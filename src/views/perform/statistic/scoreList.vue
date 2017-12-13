<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      {{statistic.curTask.task_name}}部门得分
    </p>
    <Button type="warning" slot="extra" @click.prevent="exportData">
      <Icon type="ios-download-outline"></Icon>
      导出数据</Button>
    <div ref="chart"></div>
    </div>
  </Card>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
import _ from "lodash";

export default {
  data() {
    return { chart: {} };
  },
  computed: {
    ...mapState(["statistic", "user", "paper"])
  },
  watch: {
    "statistic.curTask"(data) {
      let id = data.id;
      let user = {
        id: this.user.id,
        type_id: this.user.userType
      };
      this.getStaScoreList({ id, user });
    },
    "statistic.scoreList"(data) {
      this.refreshChart(data);
    }
  },
  methods: {
    ...mapMutations(["setStatistic"]),
    ...mapActions(["getStaScoreList"]),
    getDv(data) {
      const dv = new View();
      let value = _.cloneDeep(data);
      value = value.map((item, i) => {
        item.level = data.length - i;
        return item;
      });
      dv.source(value).transform({
        type: "fold",
        fields: ["工作效果", "团队建设", "服务配合", "持续改进"], // 展开字段集
        key: "dept_name", // key字段
        value: "score", // value字段
        retains: ["dept"]
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
        height: 1000,
        padding: [5, 20, 65, 85]
      });

      let dv = this.getDv(this.statistic.scoreList);
      this.chart.source(dv);

      this.chart.axis("dept", {
        alias: "部门",
        label: {
          offset: 4,
          formatter: val => {
            let dept = this.statistic.scoreList.find(item => item.dept == val);

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
            return dept.level + "." + str;
          }
        }
      });

      this.chart.coord().transpose();
      this.chart
        .intervalStack()
        .position("dept*score")
        // .label("score")
        .color("dept_name")
        .size(22);
      this.chart.render();

      this.chart.on("interval:click", ev => {
        const data = ev.data;
        if (data) {
          let dept = this.statistic.scoreList.find(
            item => item.dept == data._origin.dept
          );

          this.setStatistic({
            key: "curDept",
            value: dept
          });

          let users = this.paper.userList.filter(
            item => item.dept == dept.dept_id
          );

          this.setStatistic({
            key: "deptLeaders",
            value: users
          });

          // this.$Message.success(JSON.stringify(dept));
        }
      });
    },
    exportData() {
      let data = _.cloneDeep(this.statistic.scoreList);
      console.log(data);
    }
  },
  mounted() {
    this.initChart();
  }
};
</script>
