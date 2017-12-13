
<template>
  <Row :gutter="10">
    <Col :md="8" :lg="8" :sm="24">
    <v-list></v-list>
    </Col>
    <Col :md="16" :lg="16" :sm="24">
    <Row :gutter="10">
      <Col :md="12" :lg="12" :sm="24">
      <v-panel></v-panel>
      </Col>
      <Col :md="12" :lg="12" :sm="24">
      <v-histo :title="statistic.curTask.task_name" :data="mainHistoList"></v-histo>
      </Col>
      <Col :md="24" class="margin-top-15">
      <Alert show-icon>
        直方图
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">直方图主要用来反映一组样本数据的分布情况，可以近似估计一个数值类变量的概率分布，通过直方图还可以观察和估计哪些数据比较集中，异常或者孤立的数据分布在何处。 </template>
      </Alert>
      </Col>
      <Col :md="12" :lg="12" :sm="24">
      <v-histo title="工作效果" :data="workHistoList"></v-histo>
      </Col>
      <Col :md="12" :lg="12" :sm="24">
      <v-histo title="团队建设" :data="teamHistoList"></v-histo>
      </Col>
      <Col :md="12" :lg="12" :sm="24" class="margin-top-15">
      <v-histo title="服务配合" :data="serviceHistoList"></v-histo>
      </Col>
      <Col :md="12" :lg="12" :sm="24" class="margin-top-15">
      <v-histo title="持续改进" :data="enhanceHistoList"></v-histo>
      </Col>
    </Row>
    </Col>
  </Row>
</template>

<script>
import VList from "./scoreList";
import VPanel from "./panel";
// import VHisto from "./histoChart";
import VHisto from "./histo";

import { axios, API } from "../../../libs/axios";

import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "home",
  components: {
    VList,
    VPanel,
    VHisto
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
    },
    // 此处起的5组数据更换为该部门的数据
    mainHistoList() {
      return this.statistic.scoreDetail.map(item => {
        return {
          value: item.score_sub
        };
      });
    },
    workHistoList() {
      return this.statistic.scoreDetail.map(item => {
        return {
          value: item.score_work
        };
      });
    },
    teamHistoList() {
      return this.statistic.scoreDetail.map(item => {
        return {
          value: item.score_team
        };
      });
    },
    serviceHistoList() {
      return this.statistic.scoreDetail.map(item => {
        return {
          value: item.score_service
        };
      });
    },
    enhanceHistoList() {
      return this.statistic.scoreDetail.map(item => {
        return {
          value: item.score_enhance
        };
      });
    }
  },
  watch: {
    curId(val) {
      this.getCurInfo(val);
    },
    "statistic.curDept.dept_id"() {
      this.getStatScoreDetail();
    }
  },
  methods: {
    ...mapMutations(["setStatistic"]),
    ...mapActions(["getStatScoreDetail"]),
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