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
        <span class="text-error text-bold">7</span> 名</p>
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
            <div>
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

import VSlider from "../../components/slider";

import { mapState, mapMutations, mapGetters } from "vuex";

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
    ...mapState(["paper"]),
    ...mapGetters(["curDept", "isNotComplete"]),
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
    curId() {
      let params = this.$route.params;
      if (!Reflect.has(params, "id")) {
        this.notFound();
        return;
      }
      return params.id;
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
      return desc[0].content;
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
      this.formItem.score.forEach(item => {
        sum += item;
      });
      this.autoScore = sum;
      return sum;
    }
  },
  watch: {
    curDeptIdx(val) {
      this.setCurDept();
    }
  },
  methods: {
    ...mapMutations(["setPaper"]),
    submit() {
      let data = this.formItem;
      this.$Notice.open({
        title: this.dataType,
        desc: JSON.stringify(data)
      });
    },
    autoCalcScore(val) {
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
      this.formItem.score = arr;
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
      }
    },
    init() {
      this.loadStandard();
      this.setCurDept();
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
