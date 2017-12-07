<template>
  <Card shadow>
    <p slot="title">
      <Icon type="ios-paper-outline"></Icon>
      评分</p>

    <Card>
      <p slot="title">
        <Icon type="ios-paper-outline"></Icon>
        {{formItem.dept}}</p>
      <p slot="extra">
        <span class="text-primary text-bold">{{subScore}}</span> 分，第
        <span class="text-error text-bold">7</span> 名</p>
      <div class="content">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="5">
            <Col :span="12" v-for="(paper,idx) in standardList" :key="idx">
            <FormItem :label="paper.dimention">
              <v-slider v-model="formItem.score[idx]" :show-stops="true" :user-stops="stopList[idx]" :show-input="true" :max="paper.ratio*10" :tip-format="formatTip" @on-hover="dataChange(idx)" @on-input="dataChange(idx)"></v-slider>
            </FormItem>
            </Col>
          </Row>
          <FormItem label="总分">
            <v-slider v-model="autoScore" :show-stops="true" :user-stops="[80,90,95]" :show-input="true" @on-change="autoCalcScore"></v-slider>
          </FormItem>
          <Progress :percent="parseInt(15*100/23)" :stroke-width="1" hide-info></Progress>

          <div class="actions">
            <div class="info">
              <p>评分进度：15/23</p>
              <p>下一部门：XX部</p>
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
import { axios } from "../../../libs/axios";
import API from "../../../libs/api";
import VSlider from "../../components/slider";
export default {
  components: {
    VSlider
  },
  data() {
    return {
      standardList: [],
      formItem: {
        score: [0, 0, 0, 0],
        dept: "企业文化部"
      },
      curIdx: 0,
      autoScore: 0,
      dataType: "insert"
    };
  },
  computed: {
    tipText() {
      let paper = this.standardList[this.curIdx];
      let score = this.formItem.score[this.curIdx];
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
  methods: {
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
      this.curIdx = idx;
    },
    init() {
      this.loadStandard();
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
