<template>
  <Card shadow v-if="isNotComplete">
    <p slot="title">
      <Icon type="stats-bars"></Icon>
      {{curDept.name}}</p>
    <div class="content">
      <p class="leader">主管领导：{{curDept.leader}}</p>

      <p class="user">部门领导：
        <span v-for="(user,i) in curLeaders" :key="i">{{user.username}}</span>
      </p>
      <div class="score">
        <p>近期平均得分：{{hisScore['总分']}}</p>
        <p>近期平均排名：{{hisScore.level}}</p>
      </div>
    </div>
  </Card>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["paper"]),
    ...mapGetters(["curLeaders", "curDept", "isNotComplete"]),
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
    hisScore() {
      let data = this.paper.historyScoreList.find(
        item => item.dept_id == this.paper.deptList[this.curDeptIdx].value
      );
      if (typeof data == "undefined") {
        return {
          总分: "",
          level: ""
        };
      }
      return data;
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
