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

    <ul class="content">
      <li>
        <span>类型</span>
        <span>{{user.type_name}}</span>
      </li>
      <li>
        <span>状态</span>
        <span>{{user.status_name}}</span>
      </li>
    </ul>
    <div class="leader-depts" v-if="user.depts.length">
      <span v-for="(dept,j) in user.depts" :key="dept.value">{{dept.name}}
        <br v-if="j==2">
      </span>
    </div>
  </Card>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      default() {
        return {};
      }
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
.content {
  li {
    display: flex;
    justify-content: space-between;
  }
  padding-bottom: 5px;
}
.leader-depts {
  padding-top: 5px;
  border-top: #ddd 1px solid;
  span {
    padding-right: 20px;
  }
  height: 40px;
}
</style>


