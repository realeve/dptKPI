<template>
  <Card shadow>
    <div slot="title">
      <Icon type="home"></Icon>
      首页
    </div>
    <Row :gutter="20">
      <Col v-for="(item,i) in statistic.taskList" :key="item.id" :md="8" :lg="6">
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
    ...mapState(["statistic"])
  }
};
</script>