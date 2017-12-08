<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      theme: this.$store.state.app.themeColor
    };
  },
  methods: {
    ...mapActions(["getTaskList", "getDeptList", "getUserList"]),
    init() {
      this.getTaskList();
      this.getDeptList();
      this.getUserList();
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {}
};
</script>

<style lang="less">
@import "./styles/common.less";

html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
}
.app-main {
  width: 100%;
  height: 100%;
}
</style>
