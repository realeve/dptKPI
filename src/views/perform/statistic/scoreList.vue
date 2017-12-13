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

import { mapState, mapActions } from "vuex";
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
import _ from "lodash";

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
      console.log(data);
    }
  }
};
</script>
