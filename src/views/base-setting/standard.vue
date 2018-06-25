<template>
  <Card shadow>
    <div slot="title">
      <Icon type="calculator"></Icon>
      评分标准
      <Button class="margin-left-10" type="success" size="small" @click="newItem">
        <Icon type="plus-round"></Icon>
        添加</Button>
    </div>
    <Row :gutter="20">
      <Col v-for="(item,i) in taskList " :key="i" :md="12 " :lg="8 ">
      <v-card>
        <span slot="title">
          <Icon type="flag"></Icon>
        </span>
        <div slot="content" class="card-body">
          <p class="content">{{item.title}}</p>
          <div class="detail">
            <Button type="ghost" @click="viewDetail(i)">查看详情</Button>
          </div>
        </div>
      </v-card>
      </Col>
    </Row>
    </div>
  </Card>
</template>

<script>
import { axios, API } from "../../libs/axios";

import VCard from "../components/card";

export default {
  components: {
    VCard
  },
  data() {
    return {
      taskList: [
        {
          title: "2016年度部门执行力评价标准"
        },
        {
          title: "2017年度部门执行力评价标准"
        },
        {
          title: "2018年度部门执行力评价标准"
        },
        {
          title: "2018季度部门执行力评价标准"
        }
      ]
    };
  },
  methods: {
    newItem() {
      this.$Notice.open({
        title: "用户编辑",
        desc: `数据库提交数据`
      });
    },
    viewDetail(i) {
      this.$router.push({
        name: "setting_score",
        params: { id: i }
      });
    },
    init() {}
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.detail {
  width: 100%;
  display: flex;
  justify-content: center;
}
.content {
  text-align: center;
  font-size: 14pt;
}
</style>
