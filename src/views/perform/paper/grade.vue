<template>
  <Card shadow>
    <p slot="title">
      <Icon type="ios-paper-outline"></Icon>
      评分</p>

    <Card>
      <p slot="title">
        <Icon type="ios-paper-outline"></Icon>
        部门1</p>
      <p slot="extra">
        <span class="text-primary text-bold">15</span> 分，第
        <span class="text-error text-bold">7</span> 名</p>
      <div class="content">
        <Form :model="formItem" :label-width="100">
          <Row :gutter="5">
            <Col :span="12" v-for="(paper,idx) in standardList" :key="idx">
            <FormItem :label="paper.dimention">
              <v-slider v-model="formItem.score[idx]" :show-input="true" :max="paper.ratio*10" :tip-format="formatTip" @on-input="dataChange(idx)"></v-slider>
            </FormItem>
            </Col>
          </Row>
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
        score: []
      },
      curIdx: 0
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

      return desc.length ? desc[0].content : "";
    }
  },
  methods: {
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
@import "../../../styles/common.less";
</style>
