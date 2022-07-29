<template>
    <div>
        <div style="display: flex;justify-content: center; margin-top: 10px;">
            <el-input palceholder="通过用户名搜索" prefix-icon="el-icon-search"
                      style="width: 500px;margin-right: 8px;" v-model="keywords"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div class="admin-container">
            <el-card class="admin-card" v-for="(admin,index) in admins" :key="admin.id">
                <div slot="header" class="clearfix">
                    <span>{{admin.name}}</span>
                    <el-button @click="deleteAdmin(admin)" style="float: right; padding: 3px 0" type="danger"
                               icon="el-icon-delete"></el-button>
                </div>
                <div>
                    <div class="img-container">
                        <img class="userFace-img" :src="admin.userFace" :alt="admin.name" :title="admin.name">
                    </div>
                </div>
                <div class="userInfo-container">
                    <div>用户姓名：{{admin.name}}</div>
                    <div>手机号码：{{admin.phone}}</div>
                    <div>固定电话：{{admin.telephone}}</div>
                    <div>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：{{admin.address}}</div>
                    <div>用户状态：
                        <el-switch
                                v-model="admin.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="enabledChange(admin)"
                                active-text="启用"
                                inactive-text="禁用">
                        </el-switch>
                    </div>
                    <div>
                        用户角色：
                        <el-tag style="margin-right: 4px;" type="success" v-for="(role,index) in admin.roles"
                                :key="role.id">{{role.nameZh}}
                        </el-tag>
                        <el-popover
                                placement="right"
                                title="角色列表"
                                width="200"
                                @show="showAllRoles(admin)"
                                @hide="hideAllRoles(admin)"
                                trigger="click">
                            <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                <el-option
                                        v-for="(role,index) in allRoles"
                                        :key="role.id"
                                        :label="role.nameZh"
                                        :value="role.id">
                                </el-option>
                            </el-select>
                            <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                        </el-popover>
                    </div>
                    <div>
                        备注：{{admin.remark === null || admin.remark ==""?"无":admin.remark}}
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
  export default {
    name: "SysAdmin",
    data() {
      return {
        //存放所有操作员
        admins: [],
        //搜索框内容
        keywords: "",
        //所有角色
        allRoles: [],
        //已有/选择的角色
        selectedRoles: []
      };
    },
    mounted() {
      this.initAdmins();
    },
    methods: {
      //初始化所有操作员
      initAdmins() {
        this.getRequest(`/system/admin/?keywords=${this.keywords}`).then(response => {
          if (response.code === 200) {
            this.admins = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //搜索操作员
      doSearch() {
        this.initAdmins();
      },
      //删除操作员，由于接口未写，暂时无法实现
      deleteAdmin(admin) {
        this.$confirm("此操作将永久删除[" + admin.name + "]操作员, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //请求删除操作员接口
          this.deleteRequest(`/system/admin/${admin.id}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.initAdmins();
              this.$message.success("删除成功");
            } else {
              this.$message.error("删除失败");
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
      },
      //更新操作员,更新是否启用功能,无接口，暂时无法实现
      enabledChange(admin) {
        this.postRequest("/system/admin/", admin).then(response => {
          if (response.code === 200) {
            this.initAdmins();
            this.$message.success("更新成功");
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //获取所有角色
      initAllRoles() {
        this.getRequest("/system/admin/role").then(response => {
          if (response.code === 200) {
            this.allRoles = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //点击···时，展示所有角色
      showAllRoles(admin) {
        this.initAllRoles();
        let roles = admin.roles;
        this.selectedRoles = [];
        roles.forEach(role => {
          this.selectedRoles.push(role.id);
        });
      },
      //隐藏下拉选择器时，更新操作员的角色
      hideAllRoles(admin) {
        let roles = [];
        Object.assign(roles, admin.roles);
        let flag = false;
        if (roles.length !== this.selectedRoles.length) {
          flag = true;
        } else {
          for (let i = 0; i < roles.length; i++) {
            let role = roles[i];
            for (let j = 0; j < this.selectedRoles.length; j++) {
              let sRole = this.selectedRoles[j];
              if (role.id === sRole) {
                roles.splice(i, 1);
                i--;
                break;
              }
            }
          }
          if (roles.length !== 0) {
            flag = true;
          }
        }
        if (flag) {
          let url = "/system/admin/?aid=" + admin.id;
          this.selectedRoles.forEach(sRole => {
            url += "&rids=" + sRole;
          });
          this.postRequest(url).then(response => {
            if (response.code === 200) {
              this.initAdmins();
              this.$message.success("更新成功");
            } else {
              this.$message.error(response.message);
            }
          });
        }
      },
    }
  };
</script>

<style scoped>
    .admin-container {
        display: flex;
        justify-content: left;
        margin-top: 10px;
        flex-wrap: wrap;

    }

    .admin-card {
        float: left;
        width: 350px;
        margin-top: 5px;
        margin-right: 10px;
        margin-bottom: 5px;
    }

    .userFace-img {
        width: 36px;
        height: 36px;
        border-radius: 36px;
    }

    .img-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .userInfo-container {
        font-size: 12px;
        color: blue;
    }
</style>