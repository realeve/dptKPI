<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      theme: this.$store.state.app.themeColor
    };
  },
  computed: {
    ...mapState(["user", "paper"])
  },
  watch: {
    "user.uid"() {
      this.loadUserInfo();
    },
    "paper.taskList"(value) {
      this.setStatistic({
        key: "taskList",
        value: value.filter(item => item.is_start)
      });
    }
  },
  methods: {
    ...mapActions([
      "getTaskList",
      "getDeptList",
      "getUserList",
      "loadUserInfo"
    ]),
    ...mapMutations(["setStatistic"]),
    init() {
      this.getTaskList();
      this.getDeptList();
      this.getUserList();

      this.loadUserInfo();
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
