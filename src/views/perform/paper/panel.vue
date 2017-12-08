<template>

  <Card shadow>
    <p slot="title">
      <Icon type="stats-bars"></Icon>
      {{paper.deptList[paper.curDeptIdx].name}}</p>
    <div class="content">
      <p class="leader">主管领导：{{curDept.leader}}</p>

      <p class="user">部门领导：
        <span v-for="(user,i) in curLeaders" :key="i">{{user.username}}</span>
      </p>
      <div class="score">
        <p>近期平均得分：</p>
        <p>近期平均排名：</p>
      </div>
    </div>
  </Card>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["paper"]),
    curDeptIdx: {
      get() {
        return this.paper.curDeptIdx;
      },
      set(value) {
        this.setPaper({
          key: "curDeptIdx",
          value
        });
      }
    },
    curDept() {
      return this.paper.deptList[this.curDeptIdx];
    },
    curLeaders() {
      return this.paper.userList.filter(
        item => item.dept == this.curDept.value
      );
    }
  },
  methods: {
    ...mapMutations(["setPaper"])
  }
};
</script>

<style lang="less" scoped>
.content {
  p {
    line-height: 30px;
  }
  .user {
    span {
      padding-right: 15px;
    }
    border-bottom: 1px #ddd dashed;
  }
}
</style>
