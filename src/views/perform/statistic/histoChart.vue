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
import ecStat from "echarts-stat";

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
    getBin(data) {
      data = data.map(item => item.value);
      // doc about histogram see here:https://github.com/ecomfe/echarts-stat#histogram
      // scott | freedmanDiaconis | sturges | none
      let bin = ecStat.histogram(data);
      let binItem = bin.data;
      return binItem[1][0] - binItem[0][0];
    },
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
        binWidth: this.getBin(value),
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

