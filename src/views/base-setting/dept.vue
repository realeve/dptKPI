<template>
  <div>
    <Row class="margin-top-10">
      <Col span="16">
      <Card>
        <p slot="title">
          <Icon type="settings"></Icon>
          部门管理
        </p>
        <Row>
          <Col span="12">
          <Card dis-hover>
            <p slot="title">不参与评价</p>
            <div style="height: 400px;">
              <ul ref="validList" class="iview-admin-draggable-list">
                <li v-for="item in validList" :key="item.value" class="notwrap todolist-item" :data-id="item.value">
                  <span>{{ item.name }}</span>
                  <div class="info-wrapper">
                    <Button class="icon" type="primary" shape="circle" icon="edit" size="small" @click="edit(item.idx)"></Button>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
          </Col>
          <Col span="12" class="padding-left-10">
          <Card dis-hover>
            <p slot="title">参与评价</p>
            <div style="height: 400px;">
              <ul ref="deptList" class="iview-admin-draggable-list">
                <li v-for="item in deptList" :key="item.value" class="notwrap todolist-item" :data-id="item.value">
                  <span>{{ item.name }}</span>
                  <div class="info-wrapper">
                    <Button class="icon" type="primary" shape="circle" icon="edit" size="small" @click="edit(item.idx)"></Button>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
          </Col>
        </Row>
        <div class="actions">
          <Button type="primary" @click="updateDept">确认修改</Button>
        </div>
      </Card>
      </Col>
      <Col span="8" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="android-funnel"></Icon>
          新增部门
        </p>
        <div style="height: 484px;">
          <Form :model="formItem" :label-width="80">
            <FormItem label="部门名称">
              <Input v-model="formItem.dept_name" placeholder="请输入部门名称"></Input>
            </FormItem>
            <FormItem label="主管领导">
              <Select v-model="formItem.uid" style="max-width:200px">
                <Option v-for="(item,i) in leaderList" :value="item.value" :key="i">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="参与评价">
              <i-switch v-model="formItem.status" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="add">提交</Button>
              <Button type="ghost" style="margin-left: 8px" @click="reset">重置</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import { axios, API } from "../../libs/axios";
let MANAGE = API.MANAGE;
import _ from "lodash";

import Sortable from "sortablejs";

export default {
  name: "draggable-list",
  data() {
    return {
      deptList: [],
      validList: [],
      depts: [],
      leaderList: [],
      formItem: {
        dept_name: "",
        status: true,
        uid: 0,
        id: 0
      },
      editType: "NEW",
      validComponent: "",
      deptComponent: ""
    };
  },
  watch: {
    depts(val) {
      this.deptList = val.filter((item, idx) => item.status == 1);
      this.validList = val.filter((item, idx) => item.status == 0);
    }
  },
  methods: {
    reset() {
      this.formItem = {
        dept_name: "",
        status: true,
        uid: 0
      };
    },
    edit(idx) {
      let data = _.cloneDeep(this.depts[idx]);
      data.status = data.status == 1 ? true : false;
      this.formItem = {
        dept_name: data.name,
        status: data.status,
        uid: data.uid,
        condition: {
          id: data.value
        }
      };
      this.editType = "EDIT";
    },
    add() {
      let method = this.editType == "NEW" ? "post" : "put";

      let data = _.cloneDeep(this.formItem);
      if (method == "post") {
        delete data.id;
      }
      data.status = this.formItem.status ? 1 : 0;
      data.db = "db2";
      data.tbl = "data_dept";
      axios({
        data,
        method
      }).then(res => {
        this.$Notice.open({
          title: "系统提示",
          desc: "提交成功"
        });
        // 刷新数据
        this.loadDeptList();
        this.reset();
      });
    },
    updateDept() {
      let a = this.deptComponent.toArray();
      console.log(a);
    },
    initDropper() {
      document.body.ondrop = function(event) {
        event.preventDefault();
        event.stopPropagation();
      };
      this.deptComponent = Sortable.create(this.$refs.deptList, {
        group: {
          name: "list",
          pull: true
        },
        animation: 120,
        ghostClass: "placeholder-style",
        fallbackClass: "iview-admin-cloned-item"
      });

      this.validComponent = Sortable.create(this.$refs.validList, {
        group: {
          name: "list",
          pull: true
        },
        sort: false,
        filter: ".iview-admin-draggable-delete",
        animation: 120,
        fallbackClass: "iview-admin-cloned-item"
      });
    },
    loadDeptList: async function() {
      this.depts = await axios({ params: MANAGE.depts }).then(res => res.data);
      this.depts = this.depts.map((item, i) => {
        item.idx = i;
        return item;
      });
      this.initDropper();
    },
    loadLeaderList: async function() {
      this.leaderList = await axios({ params: MANAGE.leaderList }).then(
        res => res.data
      );
    },
    init: async function() {
      this.loadLeaderList();
      await this.loadDeptList();
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less">
@import "./dept.less";
.actions {
  padding-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>