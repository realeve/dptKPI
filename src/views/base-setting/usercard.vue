<template>
  <Card>
    <div slot="title">
      <span class="text-bold">{{user.username}}</span>
      <span class="sub-title">{{user.pinyin.username_full}}</span>
      <p class="sub-title-dept">{{user.dept_name}}</p>
    </div>
    <div slot="extra">
      <a href="#" @click.prevent="editUser">
        <Icon type="edit"></Icon>
        编辑
      </a><br>
      <a href="#" @click.prevent="editPsw">
        <Icon type="key"></Icon>
        修改密码
      </a>
    </div>
    <user-detail class="padding-20" :user="user" v-if="!isLeader" />
    <div v-else class="card-body">
      <img :src="`/static/images/leader/0${user.id}.jpg`" alt="leader" class="leader" />
      <user-detail class="padding-left-20 padding-top-10 padding-right-20" :user="user" />
    </div>
  </Card>
</template>
<script>
import UserDetail from "./UserDetail";

export default {
  components: {
    UserDetail
  },
  props: {
    user: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    isLeader() {
      return this.user.status == 1 && this.user.type_id < 2;
    }
  },
  methods: {
    editUser() {
      this.$emit("edit");
    },
    editPsw() {
      this.$emit("psw");
    }
  }
};
</script>
<style lang="less" scoped>
@headerSize: 144px;
.card-body {
  height: 200px;
  display: flex;
  flex-direction: row;
  .leader {
    width: @headerSize;
  }
}
</style>


