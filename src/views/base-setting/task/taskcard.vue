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
          <Button v-show="!task.is_end" type="primary" @click="perform" :disabled="task.is_end || !task.is_start">
            <span v-if="isStatis">查看评分</span>
            <span v-else>开始评分</span>
          </Button>
          <Button v-show="task.is_end" type="primary" @click="showScore">查看评分</Button>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script>
import VCard from "../../components/card";
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
    showEdit() {
      return (
        this.$store.state.user.userType == 3 &&
        !this.$route.path.includes("home")
      );
    },
    isStatis() {
      return this.$route.path.includes("statistic");
    }
  },
  methods: {
    edit() {
      this.$emit("edit");
    },
    perform() {
      if (this.isStatis) {
        this.showScore();
        return;
      }
      this.$router.push("/paper/" + this.task.id);
    },
    showScore() {
      this.$router.push("/statistic/" + this.task.id);
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

