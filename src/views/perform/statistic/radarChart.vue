<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      {{statistic.curTask.task_name}}(百分比)
    </p>
    <div ref="chart"></div>
  </Card>
</template>
<script>
import { mapState } from "vuex";
import G2 from "@antv/g2";
import { DataView } from "@antv/data-set";
import { axios, API } from "../../../libs/axios";

export default {
  data() {
    return {
      chart: {},
      standardList: [],
      min: 100,
      max: 0
    };
  },
  computed: {
    ...mapState(["statistic", "user"]),
    scores() {
      return this.statistic.scoreList.filter(
        item => item.leader_uid == this.user.id
      );
    }
  },
  // watch: {
  //   standardList(val) {
  //     this.init();
  //   }
  // },
  methods: {
    initChartSetting() {
      let option = {
        container: this.$refs.chart,
        forceFit: true,
        height: 330,
        padding: [5, 20, 65, 85]
      };
      this.chart = new G2.Chart(option);
    },
    getDV() {
      const fields = this.scores.map(item => item.dept);
      const radarData = this.standardList.map((item, i) => {
        let dimention = i == 0 ? "工作效果" : item.dimention;
        let obj = { item: dimention };

        this.scores.forEach(dept => {
          let curValue = parseFloat(
            (dept[dimention] * 100 / item.ratio).toFixed(0)
          );
          this.max = Math.max(this.max, curValue);
          this.min = Math.min(this.min, curValue);
          obj[dept.dept] = curValue;
        });

        return obj;
      });

      const dv = new DataView().source(radarData);
      dv.transform({
        type: "fold",
        fields, // 展开字段集
        key: "dept", // key字段
        value: "score" // value字段
      });
      return dv;
    },
    loadStandard: async function() {
      this.standardList = await axios({
        url: API.MANAGE.standard
      }).then(res => res);
      this.initChartSetting();
      this.init();
    },
    init() {
      if (this.scores.length == 0) {
        return;
      }
      const dv = this.getDV();

      const chart = this.chart;
      // console.log(this.min, this.max);
      chart.source(dv, {
        score: {
          min: this.min - this.min % 5,
          max: this.max // - this.max % 5 + 5
        }
      });
      chart.coord("polar", {
        radius: 0.8
      });
      chart.axis("item", {
        line: null,
        tickLine: null,
        grid: {
          lineStyle: {
            lineDash: null
          },
          hideFirstLine: false
        }
      });
      chart.axis("dept", {
        line: null,
        tickLine: null,
        grid: {
          type: "polygon",
          lineStyle: {
            lineDash: null
          },
          alternateColor: "rgba(0, 0, 0, 0.04)"
        }
      });
      chart.legend("dept", {
        marker: "circle",
        offset: 30
      });
      chart
        .line()
        .position("item*score")
        .color("dept")
        .size(2);
      chart
        .point()
        .position("item*score")
        .color("dept")
        .shape("circle")
        .size(4)
        .style({
          stroke: "#fff",
          lineWidth: 1,
          fillOpacity: 1
        });
      // chart
      //   .area()
      //   .position("item*score")
      //   .color("dept");
      chart.render();
    }
  },
  mounted() {
    this.loadStandard();
  }
};
</script>
<style lang="less" scoped>

</style>
