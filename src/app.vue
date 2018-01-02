<template>
  <div id="main" class="app-main">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
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
      setTimeout(() => {
        this.init();
      }, 100);
    },
    "paper.taskList"(value) {
      this.setStatistic({
        key: "taskList",
        value: value.filter(item => item.is_start)
      });
    },
    "user.userType"(val) {
      this.handleDeptList(val);
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
    handleDeptList(userType) {
      // 部门领导不允许评论本部门数据
      if (userType != 2) {
        return;
      }
      const idx = this.paper.deptList.findIndex(
        item => item.value == this.user.dept_id
      );
      this.paper.deptList.splice(idx, 1);
    },
    init: async function() {
      if (typeof window._secret == "undefined") {
        return;
      }
      this.getTaskList();
      this.getUserList();

      await this.getDeptList();
      await this.loadUserInfo();
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
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
