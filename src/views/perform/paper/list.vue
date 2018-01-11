<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      分数排名
    </p>

    <div ref="chart"></div>
  </Card>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import G2 from "@antv/g2";
G2.track(false);
import { View } from "@antv/data-set";
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
    getDv(data) {
      // const dv = new View();
      // dv.source(data).transform({
      //   type: "sort",
      //   callback(a, b) {
      //     return a.value > b.value;
      //   }
      // });
      let dv = _.cloneDeep(data);
      dv.sort((a, b) => a.value - b.value);
      return dv.map((item, i) => {
        item.name = `${item.name}.${data.length - i}`;
        return item;
      });
      // return dv;
    },
    refreshChart(data) {
      let dv = this.getDv(data);
      this.chart.changeData(dv);
    },
    initChart() {
      this.chart = new G2.Chart({
        container: this.$refs.chart,
        forceFit: true,
        height: 1000,
        padding: [5, 20, 20, 115]
      });

      let dv = this.getDv(this.newScoreList);
      this.chart.source(dv);

      this.chart.axis("name", {
        alias: "部门",
        label: {
          offset: 4,
          formatter: val => {
            let str = val.replace("(", "\n(");
            switch (val) {
              case "钞纸成品制作部":
                str = "钞纸成品";
                break;
              case "基建与行政事务部":
                str = "基建与行政";
                break;
              case "纪检监察内审部":
                str = "纪检监察";
                break;
              case "离退休工作部":
                str = "离退部";
                break;
            }
            return str;
          }
        }
      });
      this.chart.coord().transpose();
      this.chart
        .interval()
        .position("name*value")
        // .color("name")
        .label("value")
        .size(20);
      this.chart.render();

      this.chart.on("interval:click", ev => {
        const data = ev.data;
        // console.log(data);
        if (data) {
          let curId = this.paper.deptList.findIndex(
            item => item.value == data._origin.dept_id
          );

          this.setPaper({
            key: "curDeptIdx",
            value: curId
          });
          this.setPaper({
            key: "curScore",
            value: data._origin
          });
          this.setPaper({
            key: "curScoreDetail",
            value: data._origin.score
          });
          this.setPaper({
            key: "editModel",
            value: "EDIT"
          });
        }
      });
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>
