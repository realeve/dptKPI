<template>
  <Card shadow>
    <div slot="title">
      <Icon type="person"></Icon>
      用户管理
      <Button class="margin-left-10" type="success" size="small" @click="addNew">
        <Icon type="plus-round"></Icon>
        添加</Button>
    </div>
    <div slot="extra">
      <Input v-model.trim="queryInfo" placeholder="输入姓名或部门拼音快速查找用户" style="width: 300px"></Input>
    </div>

    <Row :gutter="20">
      <Col span="6" v-for="(item,i) in xUsers" :key="item.id" class="margin-top-20 user-card">
      <user-card :user="item" @edit="editUser(item.id)" @psw="changePsw(item.id)" />
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
        <FormItem label="分管部门" v-show="curUser.type_id!=2">
          <Select multiple v-model="curUser.depts" style="width:200px">
            <Option v-for="(item,i) in deptList" :value="item.value" :key="i">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>

    <Modal v-model="pswModal" title="调整密码" @on-ok="resetPsw">
      <Form :label-width="80">
        <FormItem label="新密码">
          <Input v-model="curPsw" placeholder="请输入新密码"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Card>

</template>

<script>
import { axios, API } from "../../libs/axios";
import pinyin from "../../libs/pinyin";
import _ from "lodash";

let MANAGE = API.MANAGE;

import UserCard from "./usercard";

export default {
  components: {
    UserCard
  },
  data() {
    return {
      modal: false,
      pswModal: false,
      curPsw: "",
      curIdx: 0,
      curUser: {
        username: "",
        dept: 2,
        type_id: 2,
        depts: [],
        status: true
      },
      userList: [],
      userTypeList: [],
      deptList: [],
      leaderDepts: [],
      queryInfo: ""
    };
  },
  computed: {
    modalTitle() {
      return this.curIdx > -1
        ? "编辑【" + this.curUser.username + "】个人信息"
        : "新建用户";
    },
    xUsers() {
      let xUserList = this.userList.map(item => {
        item.pinyin = {
          username: pinyin.toPinYin(item.username),
          username_full: pinyin.toPinYinFull(item.username),
          dept_name: pinyin.toPinYin(item.dept_name),
          dept_name_full: pinyin.toPinYinFull(item.dept_name)
        };

        item.depts = [];

        if (item.type_id != 2) {
          item.depts = this.leaderDepts.filter(leader => leader.uid == item.id);
        }

        return item;
      });

      let str = this.queryInfo.toLowerCase();
      if (str == "") {
        return xUserList;
      }
      return xUserList.filter(
        item =>
          item.pinyin.username.toLowerCase().includes(str) ||
          item.pinyin.username_full.toLowerCase().includes(str) ||
          item.pinyin.dept_name.toLowerCase().includes(str) ||
          item.pinyin.dept_name_full.toLowerCase().includes(str)
      );
    }
  },
  methods: {
    editUser(uid) {
      this.modal = true;
      let item = this.userList.find(item => item.id == uid);
      this.curIdx = item.id;
      this.curUser = {
        username: item.username,
        dept: parseInt(item.dept),
        type_id: item.type_id,
        depts: [],
        status: item.status == 1 ? true : false
      };
      if (item.type_id != 2) {
        this.curUser.depts = item.depts.map(item => item.value);
      }
    },
    addNew() {
      this.modal = true;
      this.curIdx = -1;
      this.curUser.username = "";
      this.curUser.depts = [];
    },
    changePsw: async function(id) {
      this.curIdx = id;
      this.pswModal = true;
    },
    resetPsw: async function() {
      let data = {
        // db: "db1",
        tbl: "sys_user",
        psw: this.curPsw,
        condition: {
          id: this.curIdx
        }
      };
      await axios({
        method: "put",
        data
      }).then(res => {
        this.$Notice.open({
          title: "系统提示",
          desc: "密码修改成功"
        });
      });
      this.curPsw = "";
    },
    edit: async function() {
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

      let uid = await axios({
        method: this.curIdx == -1 ? "post" : "put",
        data
      }).then(res => {
        this.$Notice.open({
          title: "系统提示",
          desc: "提交成功"
        });
        return this.curIdx == -1 ? res.id : this.curIdx;
      });

      // 新增用户时，添加数据至系统页面
      if (this.curIdx == -1) {
        data = {
          // db: "db1",
          tbl: "sys_user",
          username: this.curUser.username,
          fullname: this.curUser.username,
          psw: "111111"
        };
        await axios({
          method: "post",
          data
        }).then(res => {
          this.$Notice.open({
            title: "系统提示",
            desc: "新用户密码已被重置为 111111，请修改默认密码."
          });
        });
      }

      // 更新领导所管辖部门列表
      if (data.type_id < 2) {
        this.updateManageDepts(uid, manageDepts);
        return;
      }
      this.loadUserList();
    },
    updateManageDepts: async function(uid, manageDepts) {
      let data = {
        db: "db2",
        tbl: "data_dept",
        uid,
        condition: {
          id: manageDepts
        }
      };
      await axios({
        data,
        method: "put"
      }).then(res => res.id);
      await this.init();
    },
    loadLeaderDepts: async function() {
      this.leaderDepts = await axios({ params: MANAGE.leaderDepts }).then(
        res => res.data
      );
    },
    loadUserList: async function() {
      this.userList = await axios({ params: MANAGE.userList }).then(
        res => res.data
      );
    },
    loadInitSetting: async function() {
      this.userTypeList = await axios({ params: MANAGE.userTypeList }).then(
        res => res.data
      );

      this.deptList = await axios({ params: MANAGE.deptList }).then(
        res => res.data
      );
    },
    init: async function() {
      await this.loadLeaderDepts();
      await this.loadUserList();
    }
  },
  mounted: async function() {
    await this.loadInitSetting();
    await this.init();
  }
};
</script>

<style lang="less">
// @import "../../styles/common.less";
.user-card {
  cursor: pointer;
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
  .ivu-card-body {
    padding: 0 !important;
  }
}
</style>
