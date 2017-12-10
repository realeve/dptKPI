<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      分数排名</p>
    <div id="chart" ref="chart" class="chart"></div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import G2 from "@antv/g2";
import { View } from "@antv/data-set";

export default {
  data() {
    return { chart: {} };
  },
  computed: {
    ...mapState(["paper"]),
    ...mapGetters(["newScoreList"])
  },
  watch: {
    newScoreList(data) {
      this.refreshChart(data);
    }
  },
  methods: {
    getDv(data) {
      const dv = new View();
      dv.source(data).transform({
        type: "sort",
        callback(a, b) {
          return a.value - b.value > 0;
        }
      });
      return dv;
    },
    refreshChart(data) {
      let dv = this.getDv(data);
      this.chart.changeData(dv);
    },
    initChart() {
      this.chart = new G2.Chart({
        container: "chart", //this.$refs.chart,
        //forceFit: true,
        width: 400,
        height: 400
      });

      let dv = this.getDv(this.newScoreList);
      this.chart.source(dv);

      this.chart.axis("name", {
        alias: "部门",
        label: {
          offset: 12
        }
      });
      this.chart.coord().transpose();
      this.chart
        .interval()
        .position("name*value")
        .color("name")
        .label("value")
        .size(20);
      this.chart.render();

      this.chart.on("interval:click", ev => {
        const data = ev.data;
        if (data) {
          console.log(data);
          const id = data._origin.id;
          console.log(id);
        }
      });
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

<style lang="less" scoped>
.chart {
}
</style>
