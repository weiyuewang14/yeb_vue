<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">
                    云E办
                </div>
                <el-dropdown class="userInfo" @command="commandHandler">
                  <span style="color: white;" class="el-dropdown-link">
                    {{userInfo.name}}<i><!--<img :src="user.userFace">   先注释，因为地址请求不到--></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout">注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened> <!--启动路由模式 router-->
                        <el-submenu :index="index + ''" v-for="(item,index) in routes" :key="index"
                                    v-if="!item.hidden">
                            <template slot="title">
                                <i :class="item.iconCls" style="color: #6495ed;margin-right: 5px;"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="children.path" v-for="(children,index) in item.children"
                                          :key="children.id">
                                {{children.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb v-if="this.$router.currentRoute.path!== '/home'"
                                   separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="homeWelcome" v-if="this.$router.currentRoute.path === '/home'">
                        欢迎来到云E办系统！
                    </div>
                    <router-view class="homeRouterView"></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        // user: JSON.parse(window.sessionStorage.getItem("user"))
      };
    },
    methods: {
      commandHandler(command) {
        if (command === "logout") {
          this.$confirm("此操作将注销登录, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            //注销登录
            let result = await this.postRequest("/logout");
            //如果请求成功，清空用户信息，并跳转至登录页面
            if (result.code === 200) {
              this.$message.success("注销成功");
              window.sessionStorage.removeItem("tokenStr");
              window.sessionStorage.removeItem("user");
              //清空菜单
              this.$store.commit("initRoutes", []);
              //跳转至登录页
              this.$router.replace("/");
            } else {
              alert(result.message);
            }
          }).catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });

        }
        if (command === "userInfo") {
          this.$router.push("/userinfo");
        }
      }
    },
    computed: {
      routes() {
        return this.$store.state.routes;
      },
      userInfo() {
        return this.$store.state.currentAdmin;
      }
    }
  };
</script>

<style>
    .homeHeader {
        background-color: #4f6f9e;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: 宋体;
        color: white;
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .homeWelcome {
        text-align: center;
        font-size: 30px;
        font-family: 宋体;
        color: darkturquoise;
        padding-top: 50px;
    }

    .homeRouterView {
        margin-top: 10px;
    }
</style>
