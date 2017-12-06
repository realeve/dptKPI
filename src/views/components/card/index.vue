<template>
  <div class="card">
    <div class="card-header">
      <slot name="title">
      </slot>
      <slot name="action">
      </slot>
    </div>
    <div class="card-content">
      <div class="content">
        <slot name="content">
        </slot>
      </div>
      <div class="desc">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    init() {}
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
