<style lang="less">
@import "./own-space.less";
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                个人信息
            </p>
            <div>
                <Form ref="userForm" :model="userForm" :label-width="100" label-position="right" :rules="inforValidate">
                    <FormItem label="用户姓名：" prop="name">
                        <div style="display:inline-block;width:300px;">
                            {{user.fullname}}
                        </div>
                    </FormItem>
                    <FormItem label="部门：">
                        <span>{{ userDept.name }}</span>
                    </FormItem>
                    <FormItem label="登录密码：">
                        <Button type="primary" size="small" @click="showEditPassword">修改密码</Button>
                    </FormItem>
                    <!-- <div>
                        <Button type="text" style="width: 100px;" @click="cancelEditUserInfor">取消</Button>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>
                    </div> -->
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符"></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelEditPass">取消</Button>
                <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { axios, API } from "../../libs/axios";

export default {
  name: "ownspace_index",
  data() {
    const validePhone = (rule, value, callback) => {
      var re = /^1[0-9]{10}$/;
      if (!re.test(value)) {
        callback(new Error("请输入正确格式的手机号"));
      } else {
        callback();
      }
    };
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      userForm: {
        name: "",
        department: ""
      },
      uid: "", // 登录用户的userId
      save_loading: false,
      identifyError: "", // 验证码错误
      editPasswordModal: false, // 修改密码模态框显示
      savePassLoading: false,
      oldPassError: "",
      inforValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      editPasswordForm: {
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      passwordValidate: {
        oldPass: [{ required: true, message: "请输入原密码", trigger: "blur" }],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        rePass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: valideRePassword, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapState(["user", "paper"]),
    userDept() {
      let dept = this.paper.deptList.filter(
        item => item.value == this.user.dept_id
      );
      if (typeof dept == "undefined") {
        dept = {
          leader: "",
          name: ""
        };
      } else if (this.user.dept_id == 1) {
        dept = {
          name: "董事会/经理部"
        };
      }
      return dept;
    }
  },
  methods: {
    showEditPassword() {
      this.editPasswordModal = true;
    },
    cancelEditUserInfor() {
      this.$store.commit("removeTag", "ownspace_index");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      let lastPageName = "";
      if (this.$store.state.app.pageOpenedList.length > 1) {
        lastPageName = this.$store.state.app.pageOpenedList[1].name;
      } else {
        lastPageName = this.$store.state.app.pageOpenedList[0].name;
      }
      this.$router.push({
        name: lastPageName
      });
    },
    saveEdit() {
      this.$refs["userForm"].validate(valid => {
        if (valid) {
          this.saveInfoAjax();
        }
      });
    },
    cancelEditPass() {
      this.editPasswordModal = false;
    },
    saveEditPass() {
      this.$refs["editPasswordForm"].validate(valid => {
        if (valid) {
          this.saveInfoAjax();
          // you can write ajax request here
        }
      });
    },
    saveInfoAjax() {
      this.savePassLoading = true;
      let data = {
        new: this.editPasswordForm.newPass,
        old: this.editPasswordForm.oldPass,
        uid: this.user.uid
      };
      let params = API.MANAGE.resetPsw;
      params = Object.assign(params, data);
      //   return;
      axios({ params }).then(res => {
        this.savePassLoading = false;
        this.$Message.success("保存成功");
        this.editPasswordModal = false;
        return;
      });
    }
  }
};
</script>
