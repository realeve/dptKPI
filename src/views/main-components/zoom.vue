<template>
  <div class="zoom-container">
    <div @click="zoomOut" class="full-screen-btn-con" disabled>
      <Tooltip :content="(ratio+0.1).toFixed(1)" placement="bottom">
        <Icon type="plus-round" style="font-size:20px;"></Icon>
      </Tooltip>
    </div>
    <div @click="zoomIn" class="full-screen-btn-con">
      <Tooltip :content="(ratio-0.1).toFixed(1)" placement="bottom">
        <Icon type="minus-round" style="font-size:20px;"></Icon>
      </Tooltip>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ratio: 1
    };
  },
  computed: {
    body() {
      return document.querySelector("body");
    }
  },
  watch: {
    ratio(val) {
      this.body.style.zoom = val;
      localStorage.zoomRatio = val;
    }
  },
  methods: {
    zoomOut() {
      this.ratio = Math.min(2, (this.ratio + 0.1).toFixed(1));
    },
    zoomIn() {
      this.ratio = Math.max(1, (this.ratio - 0.1).toFixed(1));
    }
  },
  mounted() {
    if (!Reflect.has(localStorage, "zoomRatio")) {
      localStorage.zoomRatio = 1;
      return;
    }
    this.ratio = parseFloat(localStorage.zoomRatio);
  }
};
</script>

<style lang="less" scoped>
.zoom-container {
  display: inline-block;
}
</style>
