<template>
  <Card shadow>
    <p slot="title">
      <Icon type="person"></Icon>
      用户管理</p>
    <div slot="extra">
      <Input v-model.trim="queryInfo" placeholder="输入姓名或部门拼音快速查找用户" style="width: 300px"></Input>
    </div>
    <Row class="margin-top-10" :gutter="20">
      <Col span="6" class="margin-top-20 user-card">
      <Card>
        <p slot="title">添加用户
        </p>
        <div class="ivu-upload ivu-upload-drag" @click="addNew">
          <Icon type="ios-plus-empty" size="36" style="color: #3399ff"></Icon>
        </div>
      </Card>
      </Col>

      <Col span="6" v-for="(item,i) in xUsers" :key="item.id" class="margin-top-20 user-card">
      <Card>
        <div slot="title">
          <span class="text-bold">{{item.username}}</span>
          <span class="sub-title">{{item.pinyin.username_full}}</span>
          <p class="sub-title-dept">{{item.dept_name}}</p>
        </div>
        <a href="#" slot="extra" @click.prevent="editUser(i)">
          <Icon type="edit"></Icon>
          编辑
        </a>
        <ul class="content">
          <li>
            <span>类型</span>
            <span>{{item.type_name}}</span>
          </li>
          <li>
            <span>状态</span>
            <span>{{item.status_name}}</span>
          </li>
          <!-- <li>
            <span>分管部门</span>
            <span>某部门</span>
          </li> -->
        </ul>
      </Card>
      </Col>
    </Row>
    <Modal v-model="modal" :title="modalTitle" @on-ok="edit">
      <Form :vmodel="curUser" :label-width="80">
        <FormItem label="姓名">
          <Input v-model="curUser.username" placeholder="请输入姓名"></Input>
        </FormItem>
        <FormItem label="部门名称">
          <Select v-model="curUser.dept" style="width:200px">
            <Option v-for="(item,i) in deptList" :value="item.value" :key="i">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户类型">
          <Select v-model="curUser.type_id" style="width:200px">
            <Option v-for="(item,i) in userTypeList" :value="item.value" :key="i">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="当前可用">
          <i-switch v-model="curUser.status" size="large">
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </FormItem>
        <FormItem label="分管部门">
          <Select multiple v-model="curUser.depts" style="width:200px">
            <Option v-for="(item,i) in deptList" :value="item.value" :key="i">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </Card>

</template>

<script>
import { axios, API } from "../../libs/axios";
import pinyin from "../../libs/pinyin";

let MANAGE = API.MANAGE;

export default {
  data() {
    return {
      modal: false,
      curIdx: 0,
      curUser: {
        username: "",
        dept: 0,
        type_id: 2,
        depts: [],
        status: true
      },
      userList: [],
      userTypeList: [],
      deptList: [],
      queryInfo: ""
    };
  },
  computed: {
    modalTitle() {
      return this.curIdx > -1
        ? "编辑【" + this.curUser.username + "】个人信息"
        : "新建用户";
    },
    xUserList() {
      return this.userList.map(item => {
        item.pinyin = {
          username: pinyin.toPinYin(item.username),
          username_full: pinyin.toPinYinFull(item.username),
          dept_name: pinyin.toPinYin(item.dept_name),
          dept_name_full: pinyin.toPinYinFull(item.dept_name)
        };
        return item;
      });
    },
    xUsers() {
      let str = this.queryInfo.toLowerCase();
      if (str == "") {
        return this.xUserList;
      }
      return this.xUserList.filter(
        item =>
          item.pinyin.username.toLowerCase().includes(str) ||
          item.pinyin.username_full.toLowerCase().includes(str) ||
          item.pinyin.dept_name.toLowerCase().includes(str) ||
          item.pinyin.dept_name_full.toLowerCase().includes(str)
      );
    }
  },
  methods: {
    editUser(idx) {
      this.modal = true;
      let item = this.userList[idx];
      this.curIdx = item.id;
      this.curUser = {
        username: item.username,
        dept: parseInt(item.dept),
        type_id: item.type_id,
        depts: [],
        status: item.status == 1 ? true : false
      };
    },
    addNew() {
      this.modal = true;
      this.curIdx = -1;
      this.curUser = {
        username: "",
        dept: 0,
        type_id: 2,
        depts: [],
        status: true
      };
    },
    edit() {
      let data = JSON.stringify(this.curUser);
      data = JSON.parse(data);
      data.status = data.status ? 1 : 0;
      let manageDepts = data.depts;
      delete data.depts;

      // 全局配置
      data.db = "db2";
      data.tbl = "data_user";
      if (this.curIdx > -1) {
        data.condition = {
          id: this.curIdx
        };
      }
      axios({
        method: this.curIdx == -1 ? "post" : "put",
        data
      }).then(res => {
        this.$Notice.open({
          title: "系统提示",
          desc: "数据成功添加"
        });
        this.loadUserList();
      });
    },
    loadUserList: async function() {
      let data = await axios({ params: MANAGE.userList }).then(res => res.data);
      this.userList = data;
    },
    loadInitSetting: async function() {
      this.userTypeList = await axios({ params: MANAGE.userTypeList }).then(
        res => res.data
      );

      this.deptList = await axios({ params: MANAGE.deptList }).then(
        res => res.data
      );
    }
  },
  mounted() {
    this.loadUserList();
    this.loadInitSetting();
  }
};
</script>

<style lang="less" scoped>
// @import "../../styles/common.less";
.user-card {
  .ivu-card-head {
    p {
      font-size: 13pt;
    }
    .sub-title,
    .sub-title-dept {
      color: #888;
      font-weight: 100;
      font-size: 10pt;
    }
    .sub-title-dept {
      letter-spacing: 0.5em;
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
