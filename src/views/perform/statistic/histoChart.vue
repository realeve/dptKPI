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

import { jStat } from "jStat";

export default {
  name: "vhisto",
  data() {
    return { chart: {}, isInited: false, binVal: "" };
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
      let splitArr = bin.data.map(item => item[0]);

      let mean = jStat.mean(data);
      let std = jStat.stdev(data);

      this.binVal = binItem[1][0] - binItem[0][0];

      return splitArr.map((x, i) => {
        return {
          value: x,
          pdf: jStat.normal.pdf(x, mean, std),
          count: binItem[i][1]
        };
      });
      // return binVal;
    },
    getDv(data) {
      const dv = new View();
      let value = _.cloneDeep(data);
      return this.getBin(value);

      // dv.source(value).transform({
      //   type: "bin.histogram",
      //   fields: "value",
      //   binWidth: this.getBin(value),
      //   as: ["value", "count"]
      // });

      // console.log(dv);
      // return dv;
    },
    refreshChart(data) {
      if (this.isInited) {
        let dv = this.getDv(data);
        this.chart.changeData(dv);
      } else {
        this.initChart();
      }
    },
    getLevelByName(name) {
      this.stat;
    },
    initChart() {
      if (this.data.length == 0) {
        return;
      }
      let dv = this.getDv(this.data);
      let width = this.chart._attrs.width;
      let len = dv.length;
      let itemWidth = Math.floor(width / len) - 5;

      this.chart.tooltip({
        showTitle: false,
        itemTpl: "<li>{value}分<br> 出现{count}次</li>"
      });

      this.chart
        .interval()
        .position("value*count")
        .size(itemWidth)
        .tooltip("value*count", (value, count) => {
          let item = this.binVal / 2;
          return {
            value: value - item + "至" + (value + item),
            count
          };
        });

      this.chart
        .line()
        .position("value*pdf")
        .shape("smooth")
        .size(2)
        .color("#4cca72")
        .tooltip(false);

      this.chart.tooltip({
        crosshairs: false,
        inPlot: false,
        position: "top"
      });

      this.chart.source(dv, {
        value: {
          alias: "得分区间"
          // formatter: val => {
          //   let item = this.binVal / 2;
          //   return val - item + "至" + (val + item);
          // }
        },
        count: {
          min: 0,
          alias: "出现次数"
        }
      });
      this.chart.render();
      this.isInited = true;
    }
  },
  mounted() {
    this.chart = new G2.Chart({
      container: this.$refs.chart,
      forceFit: true,
      height: 232,
      padding: [10, 10, 30, 24]
    });
    this.initChart();
  }
};
</script>

