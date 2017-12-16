<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      {{statistic.curTask.task_name}}部门得分
    </p>
    <Button type="warning" slot="extra" @click.prevent="exportData">
      <Icon type="ios-download-outline"></Icon>
      导出数据</Button>
    <Tabs value="name1">
      <TabPane label="总分" name="name1">
        <bar-chart :fields='["工作效果", "团队建设", "服务配合", "持续改进"]'></bar-chart>
      </TabPane>
      <TabPane label="工作效果" name="name2">
        <bar-chart :fields="['工作效果']"></bar-chart>
      </TabPane>
      <TabPane label="团队建设" name="name3">
        <bar-chart :fields="['团队建设']"></bar-chart>
      </TabPane>
      <TabPane label="服务配合" name="name4">
        <bar-chart :fields="['服务配合']"></bar-chart>
      </TabPane>
      <TabPane label="持续改进" name="name5">
        <bar-chart :fields="['持续改进']"></bar-chart>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import BarChart from "./barChart";

import excel from "../../../libs/excel";

import { mapState } from "vuex";

export default {
  components: {
    BarChart
  },
  data() {
    return { chart: {} };
  },
  computed: {
    ...mapState(["statistic", "user", "paper"])
  },
  methods: {
    exportData() {
      let data = _.cloneDeep(this.statistic.scoreList);
      data.sort((b, a) => a.score_sub - b.score_sub);
      let header = [
        "编号",
        "部门",
        "分管领导",
        "工作效果",
        "团队建设",
        "服务配合",
        "持续改进",
        "最终得分",
        "最低分",
        "最高分",
        "平均分"
      ];
      let filename = this.statistic.curTask.task_name;
      let body = data.map((item, i) => [
        i + 1,
        item.dept,
        item.leader,
        item["工作效果"],
        item["团队建设"],
        item["服务配合"],
        item["持续改进"],
        item.score_sub,
        item["最低分"],
        item["最高分"],
        parseFloat(item["算术平均分"])
      ]);
      let xlsx = new excel({
        filename,
        header,
        body
      });
      xlsx.save();
    }
  }
};
</script>
