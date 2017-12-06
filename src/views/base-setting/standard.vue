<template>
  <Card shadow>
    <p slot="title">
      <Icon type="calculator"></Icon>
      评分标准</p>
    <Row :gutter="20">
      <Col :md="12" :lg="8">
      <v-card>
        <span slot="title">
          <Icon type="ios-plus-empty"></Icon>
          新增</span>
        <div slot="content" @click="newItem">
          <div class="ivu-upload ivu-upload-drag">
            <Icon type="ios-plus-empty" size="52" style="color: #3399ff"></Icon>
          </div>
        </div>
      </v-card>
      </Col>
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
import { axios } from "../../libs/axios";
import API from "../../libs/api";
import VCard from "../components/card";

export default {
  components: {
    VCard
  },
  data() {
    return {
      taskList: [
        {
          title: "2017年度部门履职能力评价标准"
        },
        {
          title: "2016年度部门履职能力评价标准"
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
@import "../../styles/common.less";

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
