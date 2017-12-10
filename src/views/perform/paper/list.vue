<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      分数排名</p>
    <div ref="chart" class="chart"></div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import echarts from "echarts";
import { theme } from "./ali_G2";
import _ from "lodash";

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
    ...mapMutations(["setPaper"]),
    getDv(val) {
      let data = _.cloneDeep(val);
      data.sort((a, b) => a.value - b.value);
      return data;
    },
    refreshChart(data) {
      let dv = this.getDv(data);
      this.chart.setOption({
        yAxis: {
          data: (() => dv.map(item => item.name.replace("(", "\n(")))()
        },
        series: {
          id: "score",
          data: dv
        }
      });
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, theme, { renderer: "svg" });

      let data = this.getDv(this.newScoreList);
      let option = {
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: 0,
          left: 0,
          right: 10,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          type: "value",
          min: 50
        },
        yAxis: {
          name: "部门",
          type: "category",
          data: (() => data.map(item => item.name.replace("(", "\n(")))()
        },
        series: {
          id: "score",
          name: "部门评分",
          type: "bar",
          barWidth: 30,
          label: {
            normal: {
              show: true,
              position: "insideRight"
            }
          },
          dimensions: ["name", "value"],
          encode: {
            x: "name",
            y: "value"
          },
          data
        }
      };
      this.chart.setOption(option);
      this.initEvents();
    },
    initEvents() {
      this.chart.on("click", params => {
        let name = params.name;
        let item = this.newScoreList.find(item => item.name == name);
        let curId = this.paper.deptList.findIndex(item => item.name == name);
        this.setPaper({
          key: "curDeptIdx",
          value: curId
        });
        this.setPaper({
          key: "curScore",
          value: item
        });
        this.setPaper({
          key: "curScoreDetail",
          value: item.score
        });
        this.setPaper({
          key: "editModel",
          value: "EDIT"
        });
      });
      window.onresize = () => {
        this.chart.resize();
      };
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>

<style lang="less" scoped>
.chart {
  height: 800px;
  max-width: 410px;
}
</style>
