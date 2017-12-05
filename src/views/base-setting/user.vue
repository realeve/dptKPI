<template>
  <Card shadow>
    <p slot="title">
      <Icon type="person"></Icon>
      用户管理</p>
    <Row class="margin-top-10" :gutter="20">
      <Col span="6" v-for="(item,i) in userList" :key="i" class="margin-top-20 user-card">
      <Card>
        <p slot="title">{{item.username}}
          <span class="sub-title">{{item.dept}}</span>
        </p>
        <a href="#" slot="extra" @click.prevent="editUser(i)">
          <Icon type="edit"></Icon>
          调整
        </a>
        <ul class="content">
          <li>
            <span>类型</span>
            <span>{{item.type}}</span>
          </li>
          <li>
            <span>系数</span>
            <span>{{item.ratio}}</span>
          </li>
          <li>
            <span>状态</span>
            <span>{{item.status}}</span>
          </li>
          <li>
            <span>分管部门</span>
            <span>某部门</span>
          </li>
        </ul>
      </Card>
      </Col>
    </Row>
    <Modal v-model="modal" title="'编辑用户'+curUser.username+'权限信息'" @on-ok="edit">
      <Form :vmodel="curUser" :label-width="80">
        <FormItem label="部门名称">
          <Input v-model="curUser.dept" placeholder="请输入部门名称"></Input>
        </FormItem>
        <FormItem label="用户类型">
          <Input v-model="curUser.type" placeholder="请输入用户类型"></Input>
        </FormItem>
        <FormItem label="权重系数">
          <Input v-model="curUser.ratio" placeholder="请输入权重系数"></Input>
        </FormItem>
        <FormItem label="当前可用">
          <i-switch v-model="curUser.status" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="分管部门">
          <Select style="width:200px">
            <Option value="0">部门1</Option>
            <Option value="1">部门2</Option>
            <Option value="2">部门3</Option>
            <Option value="3">部门4</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </Card>

</template>

<script>
export default {
  data() {
    return {
      modal: false,
      curUser: {
        username: "张三",
        dept: "xx部",
        type: "2",
        ratio: 1,
        status: 1
      },
      userList: [
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        },
        {
          username: "张三",
          dept: "xx部",
          type: "2",
          ratio: 1,
          status: 1
        }
      ]
    };
  },
  methods: {
    editUser(idx) {
      console.log(this.userList[idx]);
      this.$Notice.open({
        title: "用户编辑",
        desc: `调整第${idx}个用户的信息`
      });
      this.modal = true;
    },
    edit() {
      this.$Notice.open({
        title: "用户编辑",
        desc: `数据库提交数据`
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
.user-card {
  .ivu-card-head {
    p {
      font-size: 13pt;
    }
    .sub-title {
      color: #888;
      font-weight: 100;
      font-size: 10pt;
    }
  }
}
.content {
  li {
    display: flex;
    justify-content: space-between;
  }
}
</style>
