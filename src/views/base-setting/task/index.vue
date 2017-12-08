<template>
  <Card shadow>
    <div slot="title">
      <Icon type="calculator"></Icon>
      任务管理
      <Button class="margin-left-10" type="success" size="small" @click="newItem">
        <Icon type="plus-round"></Icon>
        新增</Button>
    </div>

    <Row :gutter="20">
      <Col v-for="(item,i) in paper.taskList " :key="item.id" :md="8" :lg="6">
      <task-card :task="item" @edit="edit(i)"></task-card>
      </Col>
    </Row>

    <task-panel :show="modal" :title="modalTitle" :taskitem="curTask" @on-ok="addTask" @on-cancel="hidePanel" />

  </Card>
</template>

<script>
import { axios, API } from "../../../libs/axios";
let MANAGE = API.MANAGE;

import _ from "lodash";
import moment from "moment";

import TaskCard from "./taskcard";
import TaskPanel from "./taskpanel.vue";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    TaskCard,
    TaskPanel
  },
  data() {
    return {
      modalTitle: "",
      curTask: {},
      modal: false,
      editType: "NEW"
    };
  },
  computed: {
    ...mapState(["paper"])
  },
  methods: {
    ...mapActions(["getTaskList"]),
    hidePanel() {
      this.modal = false;
    },
    addTask(data) {
      this.setData(data);
      this.hidePanel();
    },
    edit(idx) {
      this.editType = "EDIT";
      this.modalTitle = "编辑任务";
      this.curTask = _.cloneDeep(this.paper.taskList[idx]);
      this.modal = true;
    },
    setData(task) {
      let data = {
        task_name: task.task_name,
        start_time: task.start_time,
        end_time: task.end_time,
        ratio_leader: task.ratio_leader,
        ratio_user: task.ratio_user
      };

      data.db = "db2";
      data.tbl = "data_task";

      let method = this.editType == "NEW" ? "post" : "put";
      if (method == "put") {
        data.condition = {
          id: task.id
        };
      }

      axios({
        data,
        method
      }).then(res => {
        this.$Notice.open({
          title: "系统提示",
          desc: "提交成功"
        });
        this.getTaskList();
      });
    },
    newItem() {
      this.editType = "NEW";
      this.modalTitle = "新建任务";

      let year = parseInt(moment().format("YYYY"));
      let month = parseInt(moment().format("MM"));

      // 下半年在次年1月评
      let start_time = year + 1 + "-01-01";
      let end_time = year + 1 + "-01-31";

      // 本年度在同年7月评
      if (month <= 7) {
        start_time = year + "-07-01";
        end_time = year + "-07-31";
      }

      this.curTask = {
        task_name: year + "年部门履职能力评价",
        start_time,
        end_time,
        ratio_leader: 0.8,
        ratio_user: 0.2,
        complete_leader: 0,
        complete_user: 0
      };
      this.modal = true;
    }
  }
};
</script>