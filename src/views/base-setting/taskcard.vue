<template>
  <v-card>
    <span slot="title">
      <Icon type="flag"></Icon>
      {{task.task_name}}
    </span>
    <Button type="ghost" slot="action" @click="edit">
      <Icon type="edit"></Icon>
      编辑
    </Button>
    <div slot="content">
      <p>开始时间：{{task.start_time}}</p>
      <p>结束时间：{{task.end_time}}</p>
      <p>领导权重：{{task.ratio_leader}}</p>
      <p>用户权重：{{task.ratio_user}}</p>
    </div>
    <div slot="footer">
      <p>领导：{{task.complete_leader}} / {{task.count_leader}} </p>
      <p>用户：{{task.complete_user}} / {{task.count_user}}</p>
    </div>
  </v-card>
</template>
<script>
import VCard from "../components/card";
export default {
  components: {
    VCard
  },
  props: {
    task: {
      type: Object
    }
  },
  methods: {
    edit() {
      this.$emit("edit");
    }
  }
};
</script>
