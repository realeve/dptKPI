<template>
  <Card shadow>
    <p slot="title">
      <Icon type="calculator"></Icon>
      任务管理</p>

  </Card>
</template>

<script>
import { axios } from "../../libs/axios";
import API from "../../libs/api";

export default {
  data() {
    return {};
  },
  methods: {
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
