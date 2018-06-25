<template>
  <Card shadow>
    <p slot="title">
      <Icon type="calculator"></Icon>
      评分标准</p>
    <Button type="warning" slot="extra" @click.prevent="addNew">
      <Icon type="ios-plus-empty"></Icon>
      新增评分项</Button>
    <!-- <a href="#" >
      
    </a> -->

    <Card class="margin-top-20" v-for="(item,i) in standardList" :key="i">
      <p slot="title">
        <Icon type="calculator"></Icon>
        {{item.dimention}}
        <Badge :count="item.ratio"></Badge>
      </p>
      <a href="#" slot="extra" @click.prevent="edit(i)">
        <Icon type="edit"></Icon>
        调整
      </a>
      <ul class="content">
        <li v-for="(detail,j) in item.detail" :key="j">
          <span class="padding-right-40">{{getChar(65+j)}}、{{detail.content}}</span>
          <span style="min-width:80px;text-align:right">{{detail.standard.min}} ~ {{detail.standard.max}}</span>
        </li>
      </ul>
    </Card>
  </Card>
</template>

<script>
import { axios, API } from "../../libs/axios";

export default {
  data() {
    return {
      standardList: []
    };
  },
  methods: {
    loadStandard: async function() {
      const { id } = this.$route.params;
      if (id < 3) {
        this.standardList = await axios({
          url: API.MANAGE.standard
        });
        return;
      }
      this.standardList = await axios({
        url: API.MANAGE.standard_season
      });
    },
    getChar(code) {
      return String.fromCharCode(code);
    },
    addNew() {
      this.$Notice.open({
        title: "add standard",
        desc: `调整第个标准的信息`
      });
    },
    edit(idx) {
      this.$Notice.open({
        title: "标准编辑",
        desc: `调整第${idx}个标准的信息`
      });
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
// @import "../../styles/common.less";
// .standard-wrapper {
//   max-width: 80%;
//   margin: 0 auto;
// }
.content {
  li {
    display: flex;
    justify-content: space-between;
    font-size: 12pt;
    padding: 10px;
  }
}
</style>
