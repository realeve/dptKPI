<style lang="less">
@import "../../styles/common.less";
@import "./dept.less";
</style>

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
            <div style="height: 560px;">
              <ul ref="validList" class="iview-admin-draggable-list"></ul>
            </div>
          </Card>
          </Col>
          <Col span="12" class="padding-left-10">
          <Card dis-hover>
            <p slot="title">参与评价</p>
            <div style="height: 560px;">
              <ul ref="deptList" class="iview-admin-draggable-list">
                <li v-for="(item, index) in deptList" :key="index" class="notwrap todolist-item" :data-index="index">
                  {{ item.name }}
                </li>
              </ul>
            </div>
          </Card>
          </Col>
        </Row>
      </Card>
      </Col>
      <Col span="8" class="padding-left-10">
      <Card>
        <p slot="title">
          <Icon type="android-funnel"></Icon>
          新增部门
        </p>
        <div style="height: 644px;">
          <Form :model="formItem" :label-width="80">
            <FormItem label="部门名称">
              <Input v-model="formItem.name" placeholder="请输入部门名称"></Input>
            </FormItem>
            <FormItem label="参与评价">
              <i-switch v-model="formItem.status" size="large">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem>
              <Button type="primary">提交</Button>
              <Button type="ghost" style="margin-left: 8px">取消</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Sortable from "sortablejs";
export default {
  name: "draggable-list",
  data() {
    return {
      deptList: [
        { name: "部门1" },
        { name: "部门2" },
        { name: "部门3" },
        { name: "部门4" },
        { name: "部门5" },
        { name: "部门6" },
        { name: "部门7" },
        { name: "部门8" },
        { name: "部门9" }
      ],
      validList: [],
      formItem: {
        name: "",
        status: 0
      }
    };
  },
  methods: {
    init() {
      // document.body.ondrop = function(event) {
      //   event.preventDefault();
      //   event.stopPropagation();
      // };
      let vm = this;

      let deptList = vm.$refs.deptList;
      Sortable.create(deptList, {
        group: {
          name: "list",
          pull: true
        },
        animation: 120,
        ghostClass: "placeholder-style",
        fallbackClass: "iview-admin-cloned-item",
        onRemove(event) {
          vm.validList.splice(
            event.newIndex,
            0,
            vm.deptList[event.item.getAttribute("data-index")]
          );
        }
      });

      let validList = vm.$refs.validList;
      Sortable.create(validList, {
        group: {
          name: "list",
          pull: true
        },
        sort: false,
        filter: ".iview-admin-draggable-delete",
        animation: 120,
        fallbackClass: "iview-admin-cloned-item",
        onRemove(event) {
          vm.validList.splice(event.oldIndex, 1);
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>