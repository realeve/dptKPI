<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit" id="login">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录部门履职评价系统
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import particles from "particles.js";
import Cookies from "js-cookie";
import { axios, login } from "../libs/axios";

export default {
  data() {
    return {
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [{ required: true, message: "账号不能为空", trigger: "blur" }],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let userInfo = await login(
            this.form.userName,
            this.form.password
          ).then(res => res);

          this.$store.commit(
            "setAvator",
            "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg"
          );

          this.$store.commit("setUserInfo", {
            key: "name",
            value: this.form.userName
          });

          this.$store.commit("setUserInfo", {
            key: "fullname",
            value: userInfo.fullname
          });

          this.$store.commit("setUserInfo", {
            key: "uid",
            value: userInfo.extra.uid
          });

          Cookies.set("user", this.form.userName);

          if (this.form.userName === "develop") {
            Cookies.set("access", 0);
          } else {
            Cookies.set("access", 1);
          }

          this.$router.push({
            name: "home_index"
          });
        }
      });
    },
    init() {
      particlesJS.load("login", "/static/data/login.json");
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>

</style>
