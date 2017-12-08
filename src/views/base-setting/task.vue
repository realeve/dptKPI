<template>
  <Card shadow>
    <div slot="title">
      <Icon type="calculator"></Icon>
      任务管理
      <Button class="margin-left-10" type="success" size="small" @click="newItem">
        <Icon type="plus-round"></Icon>
        新增</Button>
    </div>

    <Row :gutter="20">
      <Col v-for="(item,i) in taskList " :key="i" :md="12 " :lg="8 ">
      <task-card :task="item" @edit="edit(i)"></task-card>
      </Col>
    </Row>

    </div>
  </Card>
</template>

<script>
import { axios, API } from "../../libs/axios";

import VCard from "../components/card";
import TaskCard from "./taskcard";

export default {
  components: {
    VCard,
    TaskCard
  },
  data() {
    return {
      taskList: [
        {
          task_name: "2017年部门履职能力评价",
          start_time: "2017-01-01",
          end_time: "2017-12-11",
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
// @import "../../styles/common.less";
</style>
