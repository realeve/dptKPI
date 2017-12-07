<template>

  <Card shadow>
    <p slot="title">
      <Icon type="stats-bars"></Icon>
      企业文化部</p>
    <div class="content">
      <p class="leader">主管领导：时延风</p>

      <p class="user">部门领导：
        <span>唐晓琴</span>
        <span>尹放</span>
      </p>
      <div class="score">
        <p>近期平均得分：72.33</p>
        <p>近期平均排名：4</p>
      </div>
    </div>
  </Card>
</template>
<script>
export default {};
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
