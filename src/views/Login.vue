<template>
    <div>
        <el-form :rules="rules"
                 v-loading="loading"
                 element-loading-text="正在登录"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)"
                 ref="loginForm" :model="loginForm" class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" auto-complete="false" v-model="loginForm.username"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" auto-complete="false" v-model="loginForm.password"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" auto-complete="false" v-model="loginForm.captcha" placeholder="点击图片更换验证码"
                          style="width: 250px;margin-right: 5px"></el-input>
                <img :src="captchaUrl" @click="updateCaptcha">
            </el-form-item>
            <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
            <el-button type="primary" style="width: 100%" @click="submitLogin" @keydown.enter.native="submitLogin">登录
            </el-button>
        </el-form>
    </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        captchaUrl: "/captcha?time=" + new Date(),
        loginForm: {
          username: "admin",
          password: "123",
          captcha: ""
        },
        loading: false,
        checked: true,
        rules: {
          username: [{required: true, message: "请输入用户名", trigger: "blur"}],
          password: [{required: true, message: "请输入用密码", trigger: "blur"}],
          captcha: [{required: true, message: "请输入验证码", trigger: "blur"}]
        },
      };
    },
    methods: {
      //更换验证码
      updateCaptcha() {
        this.captchaUrl = "/captcha?time=" + new Date();
      },
      //登录按钮
      submitLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            // let result = this.postRequest("/login", this.loginForm);
            this.postRequest("/login", this.loginForm).then(response => {
              if (response.code === 200) {
                this.$message.success('登录成功')
                this.loading = false;
                //存储用户token
                const tokenStr = response.data.tokenHead + " " + response.data.token;
                window.sessionStorage.setItem("tokenStr", tokenStr);
                //判断是否是直接登录，如果是直接登录，跳转至登录页
                // 如果是直接跳转想去的页面，需要先登录然后跳转至想去的页面
                let path = this.$route.query.redirect;
                //跳转页面
                this.$router.replace((path === "/" || path === undefined) ? "/home" : path);
              } else {
                this.loading = false;
                this.$message.error('用户名或密码错误')
              }
            });
          } else {
            this.$message.error("请输入所有字段");
            return false;
          }
        });
      },

    }
  };
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 0px auto 0px auto;
        text-align: center;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }

    .el-form-item__content {
        display: flex;
        align-items: center;
    }
</style>