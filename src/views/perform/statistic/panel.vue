<template>
  <Card>
    <p slot="title">
      <Icon type="stats-bars"></Icon>
      {{curDept.dept}}</p>
    <div class="content">
      <Row>
        <Col :span="12">
        <p class="leader">主管领导：{{curDept.leader}}</p>
        <div class="user">
          <span>部门领导：</span>
          <ul>
            <li v-for="(user,i) in statistic.deptLeaders" :key="i">{{user.username}}</li>
          </ul>
        </div>
        <div class="detail">
          <p>{{titleList[0]}}：
            <i>{{curDept[titleList[0]]}}分</i> /
            <i>第{{curDept.level_work}}名</i>
          </p>
          <p>{{titleList[1]}}：
            <i>{{curDept['团队建设']}}分</i> /
            <i>第{{curDept.level_team}}名</i>
          </p>
          <p>{{titleList[2]}}：
            <i>{{curDept['服务配合']}}分</i> /
            <i>第{{curDept.level_service}}名</i>
          </p>
          <p>{{titleList[3]}}：
            <i>{{curDept[titleList[3]]}}分</i> /
            <i>第{{curDept.level_enhance}}名</i>
          </p>
          <p>得分范围：
            <i>{{curDept['最低分']}}分</i> 至
            <i>{{curDept['最高分']}}分</i>
          </p>
          <p>领导评分：
            <i>{{curDept['领导评分']}}分</i> /
            <i>第{{curDept.level_leader}}名</i>
          </p>
          <p>部门互评：
            <i>{{curDept['部门互评']}}分</i> /
            <i>第{{curDept.level_user}}名</i>
          </p>
        </div>
        </Col>
        <Col :span="12">
        <i-circle :size="200" :trail-width="4" :stroke-width="5" :percent="curDept.score_sub" stroke-linecap="square" stroke-color="#43a3fb">
          <div class="demo-Circle-custom">
            <h1>{{curDept.score_sub}}分
              <small>
                <Icon v-if="parseFloat(curDept.score_percent)>0" type="arrow-up-a" color="#19be6b"></Icon>
                <Icon v-else type="arrow-down-a" color="#ed3f14"></Icon>
                {{curDept.score_percent}}</small>
            </h1>
            <p>所有部门平均得分
              <i>{{curDept.score_avg}}</i>
            </p>
            <span>第
              <i>{{curDept.level}}/{{statistic.scoreList.length}}</i>名
            </span>
          </div>
        </i-circle>
        </Col>
      </Row>
    </div>
  </Card>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    titleList: {
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["statistic"]),
    curDept() {
      return this.statistic.curDept;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  & p {
    line-height: 22px;
  }
  .user {
    display: flex;
    flex-direction: row;
    border-bottom: 1px #ddd dashed;
    padding-bottom: 5px;
  }
  .detail {
    margin-top: 5px;
    & p {
      line-height: 22px;
    }
  }
}
.demo-Circle-custom {
  & h1 {
    color: #3f414d;
    font-size: 28px;
    font-weight: normal;
    & small {
      font-size: 10px;
    }
  }
  & p {
    color: #657180;
    font-size: 14px;
    margin: 5px 0 5px;
  }
  & span {
    display: block;
    padding-top: 10px;
    color: #657180;
    font-size: 14px;
    &:before {
      content: "";
      display: block;
      width: 50px;
      height: 1px;
      margin: 0 auto;
      background: #e0e3e6;
      position: relative;
      top: -10px;
    }
  }
  & span i {
    font-style: normal;
    color: #3f414d;
  }
}
</style>
