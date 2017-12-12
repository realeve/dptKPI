
<template>
  <Row :gutter="10">
    <Col :md="8" :lg="8" :sm="24">
    <v-list></v-list>
    </Col>
    <Col :md="8" :lg="8" :sm="24">
    <v-panel></v-panel>
    </Col>
  </Row>
</template>

<script>
import VList from "./scoreList";
import VPanel from "./panel";

import { axios, API } from "../../../libs/axios";

import { mapState, mapMutations } from "vuex";

export default {
  name: "home",
  components: {
    VList,
    VPanel
  },
  computed: {
    ...mapState(["statistic"]),
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
    ...mapMutations(["setStatistic"]),
    notFound() {
      this.$router.push("/403");
    },
    getCurInfo(id) {
      let curPaper = this.statistic.taskList.filter(item => item.id == id);
      if (curPaper == null || curPaper.length == 0) {
        this.notFound();
        return;
      }

      curPaper = curPaper[0];

      this.setStatistic({
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