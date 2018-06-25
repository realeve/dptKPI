<template>
  <Card shadow>
    <p slot="title">
      <Icon type="android-funnel"></Icon>
      {{statistic.curTask.task_name}}部门得分
    </p>
    <Button type="warning" slot="extra" @click.prevent="exportData" v-if="user.userType == 0 || user.userType == 3">
      <Icon type="ios-download-outline"></Icon>
      导出数据</Button>
    <Tabs value="name1">
      <TabPane label="总分" name="name1">
        <bar-chart :fields='titleList'></bar-chart>
      </TabPane>
      <TabPane label="领导评分" name="name7">
        <bar-chart :fields="['领导评分']"></bar-chart>
      </TabPane>
      <TabPane label="部门互评" name="name6">
        <bar-chart :fields="['部门互评']"></bar-chart>
      </TabPane>
      <TabPane :label="titleList[0]" name="name2">
        <bar-chart :fields="[titleList[0]]"></bar-chart>
      </TabPane>
      <TabPane :label="titleList[1]" name="name3">
        <bar-chart :fields="['团队建设']"></bar-chart>
      </TabPane>
      <TabPane :label="titleList[2]" name="name4">
        <bar-chart :fields="['服务配合']"></bar-chart>
      </TabPane>
      <TabPane :label="titleList[3]" name="name5">
        <bar-chart :fields="[titleList[3]]"></bar-chart>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import BarChart from "./barChart";

import excel from "../../../libs/excel";

import { mapState } from "vuex";

export default {
  props: {
    titleList: {
      required: true
    }
  },
  components: {
    BarChart
  },
  data() {
    return { chart: {}, standardId: 0 };
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
        ...titleList,
        "最终得分",
        "最低分",
        "最高分",
        "平均分",
        "领导评分",
        "部门互评"
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
        parseFloat(item["算术平均分"]),
        item["领导评分"],
        item["部门互评"]
      ]);
      let xlsx = new excel({
        filename,
        header,
        body
      });
      xlsx.save();
    }
  },
  mounted() {
    this.standardId = this.$route.params.id;
  }
};
</script>
