
<template>
  <Row :gutter="10">
    <Col v-if="user.userType!=2" :md="8" :sm="24">
    <v-list></v-list>
    <v-radar v-if="user.userType==1" class="margin-top-15"></v-radar>
    </Col>
    <Col :md="user.userType!=2 ? 16:24">
    <Row>
      <Col :md="12" :sm="24">
      <v-panel></v-panel>
      </Col>
      <Col :md="12" :sm="24">
      <v-histo :title="statistic.curTask.task_name" :data="mainHistoList"></v-histo>
      </Col>
      <Col :md="24" class="margin-top-5">
      <Alert show-icon>
        直方图
        <Icon type="ios-lightbulb-outline" slot="icon"></Icon>
        <template slot="desc">直方图主要用来反映一组样本数据的分布情况，可以近似估计一个数值类变量的概率分布，通过直方图还可以观察和估计哪些数据比较集中，异常或者孤立的数据分布在何处。 </template>
      </Alert>
      </Col>
      <Col :md="12" :sm="24" class="margin-top-5">
      <v-histo title="工作效果" :data="workHistoList"></v-histo>
      </Col>
      <Col :md="12" :sm="24" class="margin-top-5">
      <v-histo title="团队建设" :data="teamHistoList"></v-histo>
      </Col>
      <Col :md="12" :sm="24" class="margin-top-5">
      <v-histo title="服务配合" :data="serviceHistoList"></v-histo>
      </Col>
      <Col :md="12" :sm="24" class="margin-top-5">
      <v-histo title="持续改进" :data="enhanceHistoList"></v-histo>
      </Col>
    </Row>
    </Col>

  </Row>
</template>

<script>
import VList from "./scoreList";
import VRadar from "./radarChart";

import VPanel from "./panel";
// import VHisto from "./histoChart";
import VHisto from "./histo";

import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "home",
  components: {
    VList,
    VRadar,
    VPanel,
    VHisto
  },
  computed: {
    ...mapState(["statistic", "user", "paper"]),
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
    },
    "user.dept_id"() {
      this.init();
    },
    "statistic.scoreList"() {
      this.init();
    },
    "statistic.curTask"(data) {
      let id = data.id;
      let user = {
        id: this.user.id,
        type_id: this.user.userType
      };
      this.getStaScoreList({ id, user });
    }
  },
  methods: {
    ...mapMutations(["setStatistic"]),
    ...mapActions(["getStatScoreDetail", "getStaScoreList"]),
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
    },
    init() {
      if (this.user.dept_id == 0 || this.statistic.scoreList.length == 0) {
        return;
      }

      let dept;
      switch (this.user.userType) {
        case 2:
          dept = this.statistic.scoreList.find(
            item => item.dept_id == this.user.dept_id
          );
          break;
        case 1:
          let data = this.statistic.scoreList.filter(
            item => item.leader_uid == this.user.id
          );
          dept = data[data.length - 1];
          break;
        default:
          this.statistic.scoreList[this.statistic.scoreList.length - 1];
          return;
          break;
      }

      this.setStatistic({
        key: "curDept",
        value: dept
      });

      let users = this.paper.userList.filter(item => item.dept == dept.dept_id);

      this.setStatistic({
        key: "deptLeaders",
        value: users
      });
    }
  },
  mounted() {
    this.getCurInfo(this.curId);
    this.init();
  }
};
</script>