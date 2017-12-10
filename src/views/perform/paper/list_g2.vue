<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      分数排名</p>
    <Row>
      <Col :span="24">
      <v-chart :force-fit="true" :height="height" :data="paper.scoreList" :data-pre="dataPre">
        <v-coord :type="'rect'" :direction="'LB'" />
        <v-tooltip />
        <v-axis :data-key="'name'" :label="label" />
        <v-bar :position="'name*value'" :size="20" />
      </v-chart>
      </Col>
    </Row>
  </Card>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      dataPre: {
        transform: {
          type: "sort",
          callback(a, b) {
            return a.value - b.value > 0;
          }
        }
      },
      height: 800,
      label: { offset: 12 }
    };
  },
  computed: {
    ...mapState(["paper"])
  }
};
</script>

<style lang="less" scoped>

</style>
