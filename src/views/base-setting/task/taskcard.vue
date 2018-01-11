<template>
  <v-card>
    <span slot="title">
      <Icon type="flag"></Icon>
      {{task.task_name}}
    </span>
    <Button v-show="showEdit" type="ghost" slot="action" @click="edit">
      <Icon type="edit"></Icon>
      编辑
    </Button>
    <div slot="content">
      <p>开始时间：{{task.start_time}}</p>
      <p>结束时间：{{task.end_time}}</p>
      <p>领导权重：{{task.ratio_leader}}</p>
      <p>用户权重：{{task.ratio_user}}</p>
      <p>活动状态：{{task.status_desc}}</p>
    </div>
    <div slot="footer">
      <div class="extra">
        <div class="info">
          <span>领导：{{task.complete_leader}} / {{task.count_leader}} </span><br>
          <span>用户：{{task.complete_user}} / {{task.count_user}}</span>
        </div>
        <div class="action">
          <Button v-show="!task.is_end && !isManager" type="primary" @click="perform" :disabled="task.is_end || !task.is_start">
            <span>开始评分</span>
          </Button>
          <Button v-show="task.is_end || isCBPCLeader || isManager" @click="showScore">查看评分</Button>
          <Button v-show="isCBPCLeader || isManager" @click="showStatus">完成情况</Button>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script>
import VCard from "../../components/card";
import excel from "../../../libs/excel";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    VCard
  },
  props: {
    task: {
      type: Object
    }
  },
  computed: {
    ...mapState(["paper"]),
    showEdit() {
      return (
        this.$store.state.user.userType == 3 &&
        this.$route.path.indexOf("home") == -1
      );
    },
    isCBPCLeader() {
      return this.$store.state.user.userType == 0;
    },
    isManager() {
      return (
        this.$store.state.user.userType == 3

        // && this.$route.path.indexOf("statistic") > -1
      );
    }
  },
  methods: {
    ...mapActions(["getCompleteStatus"]),
    edit() {
      this.$emit("edit");
    },
    perform() {
      if (this.isManager) {
        this.showScore();
        return;
      }
      this.$router.push("/paper/" + this.task.id);
    },
    showScore() {
      this.$router.push("/statistic/" + this.task.id);
    },
    showStatus: async function() {
      await this.getCompleteStatus(this.task.id);
       let xlsx = new excel(this.paper.completeStatus);
      xlsx.save();
      console.log(this.paper.completeStatus);
    }
  }
};
</script>

<style lang="less" scoped>
.extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

