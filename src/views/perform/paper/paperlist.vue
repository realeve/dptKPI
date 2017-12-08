<template>
  <Card shadow>
    <div slot="title">
      <Icon type="home"></Icon>
      首页
    </div>
    <Row :gutter="20">
      <Col v-for="(item,i) in taskList" :key="item.id" :md="8" :lg="6">
      <task-card :task="item"></task-card>
      </Col>
    </Row>
  </Card>
</template>

<script>
import TaskCard from "../../base-setting/task/taskcard";

import { mapState } from "vuex";

export default {
  components: {
    TaskCard
  },
  computed: {
    ...mapState(["paper"]),
    taskList() {
      return this.paper.taskList.filter(item => item.is_start && !item.is_end);
    }
  }
};
</script>