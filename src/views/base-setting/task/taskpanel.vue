<template>

  <Modal v-model="modal" :title="title" @on-ok="edit" @on-cancel="hidePanel">
    <Form :vmodel="task" :label-width="80">
      <FormItem label="任务名称">
        <Input v-model="task.task_name" placeholder="请输入任务名称"></Input>
      </FormItem>
      <FormItem label="起止日期">
        <DatePicker v-model="time_range" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="领导得分比例">
        <InputNumber v-model="task.ratio_leader" placeholder="请输入领导得分比例" :min="0" :max="1" :step="0.1"></InputNumber>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import moment from "moment";

export default {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: "新增"
    },
    taskitem: {
      type: Object,
      default() {
        return {
          task_name: "2017年部门执行力评价",
          start_time: "2017-01-01",
          end_time: "2017-12-11",
          ratio_leader: 0.8,
          ratio_user: 0.2,
          complete_leader: 0,
          complete_user: 0
        };
      }
    }
  },
  data() {
    return {
      modal: false,
      task: {},
      time_range: []
    };
  },
  watch: {
    show(val) {
      this.modal = val;
    },
    taskitem(val) {
      this.task = val;
      this.time_range = [val.start_time, val.end_time];
    },
    time_range(val) {
      this.task.start_time = moment(val[0]).format("YYYY-MM-DD");
      this.task.end_time = moment(val[1]).format("YYYY-MM-DD");
    },
    "task.ratio_leader"(val) {
      this.task.ratio_user = (1 - val).toFixed(1);
    }
  },
  methods: {
    hidePanel() {
      this.$emit("on-cancel");
    },
    edit() {
      this.$emit("on-ok", this.task);
    }
  }
};
</script>
<style lang="less" scoped>
</style>
