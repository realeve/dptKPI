
<template>
  <div>
    <Row :gutter="10">
      <Col :md="16" :lg="16" :sm="24">
      <v-grade></v-grade>
      </Col>
      <Col :md="8" :lg="8" :sm="24">
      <!-- <Row>
        <Col :span="24">
        <v-panel></v-panel>
        </Col>
        <Col :span="24" class="margin-top-20">
        <v-list></v-list>
        </Col>
      </Row> -->
      <v-panel></v-panel>
      <v-list class="margin-top-20"></v-list>
      </Col>
    </Row>
  </div>
</template>

<script>
import VGrade from "./grade";
import VPanel from "./panel";
import VList from "./list";

import { axios, API } from "../../../libs/axios";

import { mapState, mapMutations } from "vuex";

export default {
  name: "home",
  components: {
    VGrade,
    VPanel,
    VList
  },
  computed: {
    ...mapState(["paper"]),
    curId() {
      let params = this.$route.params;
      if (!Reflect.has(params, "id")) {
        this.notFound();
        return;
      }
      return params.id;
    }
  },
  watch: {
    curId(val) {
      this.getCurInfo(val);
    }
  },
  methods: {
    ...mapMutations(["setPaper"]),
    notFound() {
      this.$router.push("/403");
    },
    getCurInfo(id) {
      let curPaper = this.paper.taskList.filter(item => item.id == id);
      if (curPaper == null || curPaper.length == 0) {
        this.notFound();
        return;
      }

      curPaper = curPaper[0];

      if (!curPaper.is_start) {
        this.$Message.error("活动尚未开始");
        this.$router.push("/");
        return;
      } else if (curPaper.is_end) {
        this.$Message.error("活动已结束");
        this.$router.push("/");
        return;
      }

      this.setPaper({
        key: "curTask",
        value: curPaper
      });
    }
  },
  mounted() {
    this.getCurInfo(this.curId);
  }
};
</script>
<style lang="less" scoped>
.margin-top-20 {
  margin-top: 20px;
}
</style>