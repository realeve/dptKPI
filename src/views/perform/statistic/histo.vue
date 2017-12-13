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
    return {
      chart: {},
      isInited: false,
      binVal: "",
      binView: {},
      lineView: {}
    };
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
          pdf: jStat.normal.pdf(x, mean, std)
        };
      });
    },
    getDv(data) {
      const bin = new View();
      const dvLine = new View();
      let value = _.cloneDeep(data);
      let pdf = this.getBin(value);

      bin.source(value).transform({
        type: "bin.histogram",
        fields: "value",
        binWidth: this.binVal,
        as: ["value", "count"]
      });

      dvLine.source(pdf).transform({
        type: "fold",
        fields: ["pdf"], // 展开字段集
        key: "score", // key字段
        value: "pdf" // value字段
      });

      return { bin, pdf: dvLine };
    },
    refreshChart(data) {
      if (this.isInited) {
        let option = this.getDv(data);
        this.binView.changeData(option.bin);
        this.lineView.changeData(option.pdf);
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
      let option = this.getDv(this.data);

      // this.binView.tooltip({
      //   showTitle: false,
      //   itemTpl: "<li>{value}分<br> 出现{count}次</li>",
      //   crosshairs: false,
      //   inPlot: false,
      //   position: "top"
      // });

      this.binView.source(option.bin, {
        value: {
          alias: "得分区间"
        },
        count: {
          min: 0,
          alias: "出现次数"
        }
      });
      this.binView.interval().position("value*count");
      this.lineView.source(option.pdf, {
        value: {
          alias: "得分区间"
        },
        pdf: {
          min: 0
        }
      });

      this.lineView
        .line()
        .position("value*pdf")
        .shape("smooth")
        .size(2)
        .color("#4cca72")
        .tooltip(false);

      this.lineView.axis("value", false);
      this.lineView.axis("pdf", false);

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
    this.binView = this.chart.view();
    this.lineView = this.chart.view();
    this.initChart();
  }
};
</script>

