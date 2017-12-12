<template>
  <Card>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      {{title}} 直方图</p>
    <div ref="chart"></div>
  </Card>
  </div>
</template>

<script>
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
import _ from "lodash";

export default {
  name: "vhisto",
  data() {
    return { chart: {} };
  },
  props: {
    title: {
      type: String
    },
    data: {
      type: Array
    }
  },
  watch: {
    data(val) {
      this.refreshChart(val);
    }
  },
  methods: {
    getDv(data) {
      const dv = new View();
      let value = _.cloneDeep(data);
      value = value.map((item, i) => {
        item.level = data.length - i;
        return item;
      });
      dv.source(value).transform({
        type: "bin.histogram",
        fields: "value",
        binWidth: this.title.length > 4 ? 5 : 2,
        as: ["value", "count"]
      });
      return dv;
    },
    refreshChart(data) {
      let dv = this.getDv(data);
      this.chart.changeData(dv);
    },
    getLevelByName(name) {
      this.stat;
    },
    initChart() {
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        height: 232,
        padding: [10, 15, 30, 24]
      });
      this.chart.interval().position("value*count");

      this.chart.tooltip({
        crosshairs: false,
        inPlot: false,
        position: "top"
      });

      if (this.data.length == 0) {
        return;
      }

      let dv = this.getDv(this.data);
      this.chart.source(dv);
      this.chart.render();
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

