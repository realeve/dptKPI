<template>
  <Card shadow>
    <p slot="title">
      <Icon type="ios-paper-outline"></Icon>
      {{paper.curTask.task_name}}</p>
    <Card>
      <p slot="title">
        <Icon type="ios-paper-outline"></Icon>
        {{curDept.name}}</p>
      <p slot="extra">
        <span class="text-primary text-bold">{{subScore}}</span> 分，第
        <span class="text-error text-bold">{{scoreLevel}}</span> 名</p>
      <div class="content">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="5">
            <Col :span="12" v-for="(item,idx) in standardList" :key="idx">
            <FormItem :label="item.dimention">
              <v-slider v-model="formItem.score[idx]" :show-stops="true" :user-stops="stopList[idx]" :show-input="true" :max="item.ratio*10" :tip-format="formatTip" @on-hover="dataChange(idx)" @on-input="dataChange(idx)"></v-slider>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="总分">
            <v-slider v-model="autoScore" :show-stops="true" :user-stops="[70,80,90]" :show-input="true" @on-change="autoCalcScore"></v-slider>
          </FormItem>
          <Progress :percent="percent" :stroke-width="1" hide-info></Progress>

          <div class="actions">
            <div class="info">
              <p>评分进度：{{paper.curDeptIdx+1}} /{{paper.deptList.length}}</p>
              <p>下一部门：
                <span v-if="isNotComplete">{{nextDept}}</span>
                <span v-else>已完结，点击右侧列表修改评分</span>
              </p>
            </div>
            <div v-show="subScore>0 && isNotComplete">
              <Button type="primary" class="margin-right-30" @click="submit">提交</Button>
            </div>
          </div>
        </Form>
      </div>
    </Card>

  </Card>
</template>
<script>
import { axios, API } from "../../../libs/axios";
import util from "../../../libs/util";
import VSlider from "../../components/slider";

import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  components: {
    VSlider
  },
  data() {
    return {
      standardList: [],
      formItem: {
        score: [0, 0, 0, 0],
        dept: ""
      },
      curQuestionIdx: 0,
      autoScore: 0,
      dataType: "insert",
      nextDept: ""
    };
  },
  computed: {
    ...mapState(["paper", "user"]),
    ...mapGetters(["curDept", "isNotComplete"]),
    scoreList: {
      get() {
        return this.paper.scoreList;
      },
      set(value) {
        this.setPaper({
          key: "scoreList",
          value
        });
      }
    },
    curId() {
      let params = this.$route.params;
      if (!Reflect.has(params, "id")) {
        this.notFound();
        return;
      }
      return params.id;
    },
    scoreLevel() {
      let level = 1;
      this.paper.scoreList.forEach(item => {
        if (parseInt(item.value) > this.subScore) {
          level++;
        }
      });
      return level;
    },
    curDeptIdx: {
      get() {
        return this.paper.curDeptIdx;
      },
      set(value) {
        this.setPaper({
          key: "curDeptIdx",
          value
        });
      }
    },
    percent() {
      return parseInt(this.curDeptIdx * 100 / this.paper.deptList.length);
    },
    tipText() {
      let paper = this.standardList[this.curQuestionIdx];
      let score = this.formItem.score[this.curQuestionIdx];
      let desc = paper.detail.filter(
        item =>
          score <= item.standard.max * 10 && score > item.standard.min * 10
      );
      if (score == 0) {
        desc[0] = paper.detail[paper.detail.length - 1];
      }
      let data = desc[0];
      return typeof data != "undefined" ? data.content : "";
    },
    stopList() {
      return this.standardList.map(option => {
        let stops = option.detail.map(item => item.standard.min * 10);
        stops.pop();
        return stops.sort((a, b) => a - b);
      });
    },
    subScore() {
      let sum = 0;
      if (!this.isNotComplete) {
        return sum;
      }
      this.formItem.score.forEach(item => {
        sum += item;
      });
      // this.autoScore = sum;
      let value = {
        name: this.curDept.name,
        value: sum,
        dept_id: this.curDept.value,
        score: this.formItem.score
      };
      if (this.paper.editModel == "EDIT") {
        value.id = this.paper.curScore.id;
      }
      this.setPaper({
        key: "curScore",
        value
      });
      return sum;
    }
  },
  watch: {
    curDeptIdx(val) {
      this.setCurDept();
    },
    "user.uid"(val) {
      this.getScoreList({
        task_id: this.curId,
        uid: this.user.uid
      });
    },
    scoreList(val) {
      if (this.isNotComplete) {
        this.curDeptIdx = val.length;
      }
    },
    "paper.curScoreDetail"(val) {
      let sum = val[0] + val[1] + val[2] + val[3];
      this.autoScore = sum;
      this.autoCalcScore(sum);
      // this.formItem.score = val;
    }
  },
  methods: {
    ...mapMutations(["setPaper"]),
    ...mapActions(["getScoreList"]),
    getFormData() {
      let score = this.formItem.score;
      return {
        db: "db2",
        tbl: "data_score",
        task_id: this.paper.curTask.id,
        uid: this.user.uid,
        dept_id: this.curDept.value,
        score_work: score[0],
        score_team: score[1],
        score_service: score[2],
        score_enhance: score[3],
        score_sub: this.subScore
      };
    },
    submit: async function() {
      let data = this.getFormData();
      let method = this.paper.editModel == "NEW" ? "post" : "put";
      if (method == "put") {
        data.condition = {
          id: this.paper.curScore.id
        };
      }
      await axios({ method, data });

      this.$Notice.open({
        title: "系统提示",
        desc: "数据提交成功"
      });

      this.refreshChart();

      this.formItem.score = [0, 0, 0, 0];
      this.autoScore = 0;
      this.setPaper({
        key: "editModel",
        value: "NEW"
      });
    },
    autoCalcScore(val) {
      if (!this.isNotComplete) {
        return;
      }
      let percent = val / 100;
      let arr = [];
      let sum = 0;
      this.formItem.score.forEach((item, i) => {
        if (i < this.formItem.score.length - 1) {
          let max = this.standardList[i].ratio * 10;
          let newScore = Math.min(max, parseInt(max * percent));
          arr.push(newScore);
          sum += newScore;
        } else {
          arr.push(val - sum);
        }
      });
      this.$nextTick(() => {
        this.formItem.score = arr;
      });
    },
    loadStandard: async function() {
      this.standardList = await axios({
        url: API.MANAGE.standard
      });
    },
    formatTip(val) {
      return this.tipText;
    },
    dataChange(idx) {
      this.curQuestionIdx = idx;
    },
    setCurDept() {
      if (this.isNotComplete) {
        this.nextDept = this.paper.deptList[this.curDeptIdx + 1].name;
        this.formItem.dept = this.curDeptIdx;
      }
    },
    refreshChart() {
      this.getScoreList({
        task_id: this.curId,
        uid: this.user.uid
      });
    },
    init() {
      this.loadStandard();
      this.setCurDept();
      this.refreshChart();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  .info {
    font-size: 9pt;
  }
}
</style>
