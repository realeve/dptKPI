<template>
  <Card shadow>
    <p slot="title">
      <Icon type="calculator"></Icon>
      任务管理</p>
    <Row :gutter="20">
      <Col :md="12" :lg="8">
      <v-card>
        <span slot="title">
          <Icon type="ios-plus-empty"></Icon>
          新增</span>
        <div slot="content" @click="newItem">
          <div class="ivu-upload ivu-upload-drag">
            <Icon type="ios-plus-empty" size="52" style="color: #3399ff" class="padding-top-10 padding-bottom-10"></Icon>
          </div>
        </div>
      </v-card>
      </Col>
      <Col v-for="(item,i) in taskList " :key="i" :md="12 " :lg="8 ">
      <v-card>
        <span slot="title">
          <Icon type="flag"></Icon>
          {{item.title}}
        </span>
        <Button type="ghost" slot="action" @click="edit(i) ">
          <Icon type="edit"></Icon>
          编辑
        </Button>
        <div slot="content">
          <p>开始时间：{{item.tstart}}</p>
          <p>结束时间：{{item.tend}}</p>
          <p>领导权重：{{item.ratio_leader}}</p>
          <p>用户权重：{{item.ratio_user}}</p>
        </div>
        <div slot="footer ">领导：{{item.complete_leader}} / {{item.count_leader}} 用户：{{item.complete_user}} / {{item.count_user}} </div>
      </v-card>
      </Col>
    </Row>
    </div>
  </Card>
</template>

<script>
import { axios } from "../../libs/axios";
import API from "../../libs/api";
import VCard from "../components/card";

export default {
  components: {
    VCard
  },
  data() {
    return {
      taskList: [
        {
          title: "2017年部门履职能力评价",
          tstart: "2017-01-01",
          tend: "2017-12-11",
          ratio_leader: 0.8,
          ratio_user: 0.2,
          count_leader: 7,
          complete_leader: 3,
          count_user: 25,
          complete_user: 13
        },
        {
          title: "2016年部门履职能力评价",
          tstart: "2016-01-01",
          tend: "2016-12-11",
          ratio_leader: 0.8,
          ratio_user: 0.2,
          count_leader: 7,
          complete_leader: 3,
          count_user: 25,
          complete_user: 13
        }
      ]
    };
  },
  methods: {
    edit(idx) {
      this.$Notice.open({
        title: "用户编辑" + idx,
        desc: `数据库提交数据`
      });
    },
    newItem() {
      this.$Notice.open({
        title: "用户编辑",
        desc: `数据库提交数据`
      });
    },
    init() {}
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
</style>
