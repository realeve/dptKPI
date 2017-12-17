<template>
  <div ref="chart"></div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
import _ from "lodash";

export default {
  props: {
    fields: {
      type: Array
    }
  },
  data() {
    return { chart: {}, isInited: false };
  },
  computed: {
    ...mapState(["statistic", "user", "paper"])
  },
  watch: {
    "statistic.scoreList"(data) {
      this.refreshChart(data);
    },
    "user.userType"() {
      this.initChartSetting();
    }
  },
  methods: {
    ...mapMutations(["setStatistic"]),
    getDv(data) {
      const dv = new View();
      let value = _.cloneDeep(data);

      // 如果是公司副总，显示其分管部门的得分
      if (this.user.userType == 1) {
        value = value.filter(item => item.leader_uid == this.user.id);
      }

      let key = this.fields[0];
      if (this.fields.length == 1) {
        value = value.sort((a, b) => a[key] - b[key]);
      }
      value = value.map((item, i) => {
        item.level = data.length - i;
        return item;
      });
      dv.source(value).transform({
        type: "fold",
        fields: this.fields, // 展开字段集
        key: "dept_name", // key字段
        value: "score", // value字段
        retains: ["dept"]
      });
      return dv;
    },
    refreshChart(data) {
      if (this.isInited) {
        let dv = this.getDv(data);
        this.chart.changeData(dv);
        return;
      }
      this.init();
    },
    getLevelByName(name) {
      this.stat;
    },
    initChartSetting() {
      if (this.user.userType == -1) {
        return;
      }
      let option = {
        container: this.$refs.chart,
        forceFit: true,
        height: this.user.userType == 1 ? 400 : 830,
        padding: [5, 20, 65, 85]
      };
      this.chart = new G2.Chart(option);
    },
    init() {
      if (this.statistic.scoreList.length == 0) {
        return;
      }
      let dv = this.getDv(this.statistic.scoreList);
      this.chart.source(dv);
      this.chart.axis("dept", {
        alias: "部门",
        label: {
          offset: 4,
          formatter: val => {
            let dept = dv.origin.find(item => item.dept == val);

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

      if (this.fields.length == 1) {
        this.chart
          .intervalStack()
          .position("dept*score")
          .label("score", {
            offset: 5
          })
          .color("dept_name")
          .size(22);
      } else {
        this.chart
          .intervalStack()
          .position("dept*score")
          // .label("score")
          .color("dept_name")
          .size(22);
      }
      this.chart.coord().transpose();
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
        }
      });

      this.isInited = true;
    }
  },
  mounted() {
    this.initChartSetting();
    this.init();
  }
};
</script>
