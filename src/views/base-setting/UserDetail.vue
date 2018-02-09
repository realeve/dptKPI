<template>
  <div class="main">
    <ul class="content">
      <li>
        <span>类型</span>
        <strong>{{user.type_name}}</strong>
      </li>
      <li v-show="user.status==0">
        <span>状态</span>
        <span>{{user.status_name}}</span>
      </li>
    </ul>
    <div class="leader-depts" v-if="user.depts.length">
      <span v-for="(dept,j) in user.depts" :key="dept.value">{{dept.name}}
        <br v-if="j%2==1">
      </span>
    </div>
  </div>
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
  }
};
</script>
<style lang="less" scoped>
.main {
  width: 100%;
}
.content {
  width: 100%;
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


