<template>
    <div>
        <div class="permissionManaTool">
            <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" placeholder="请输入角色中文名" v-model="role.nameZh">
            </el-input>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
        <div class="permissionManaMain">
            <el-collapse v-model="activeName" @change="handleChange" accordion>
                <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles" :key="role.id">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                            <el-button style="float: right; padding: 3px 0;color:red;" icon="el-icon-delete"
                                       type="text" @click="doDeleteRole(role)"></el-button>
                        </div>
                        <div>
                            <el-tree show-checkbox
                                     :data="allMenus"
                                     :props="defaultProps"
                                     :default-checked-keys="selectMenus"
                                     ref="tree"
                                     node-key="id"></el-tree>
                            <div style="display: flex;justify-content: flex-end;">
                                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                                <el-button size="mini" type="primary" @click="doUpdate(role.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>

            </el-collapse>
        </div>
    </div>
</template>

<script>
  export default {
    name: "PermissMana",
    data() {
      return {
        role: {
          name: "",
          nameZh: ""
        },
        //存放所有的角色
        roles: "",
        //存放所有菜单
        allMenus: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        //选中的菜单
        selectMenus: [],
        activeName: -1
      };
    },
    mounted() {
      this.initRoles();
    },
    methods: {
      // 点击折叠面板
      handleChange(roleId) {
        //点击哪个，就给哪个初始数据
        if (roleId) {
          this.initAllMenus();
          this.initSelectMenus(roleId);
        }
      },
      //初始展示所有的角色
      initRoles() {
        this.getRequest("/system/basic/role/").then(response => {
          if (response.code === 200) {
            this.roles = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //初始所有的菜单
      initAllMenus() {
        this.getRequest("/system/basic/role/menus").then(response => {
          if (response.code === 200) {
            this.allMenus = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //初始化选择的菜单
      initSelectMenus(roleId) {
        this.getRequest(`/system/basic/role/mid/${roleId}`).then(response => {
          if (response.code === 200) {
            this.selectMenus = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //更新每个角色的权限
      doUpdate(roleId, index) {
        let tree = this.$refs.tree[index];
        //获取所有选择的节点
        let selectedKeys = tree.getCheckedKeys(true);
        let url = `/system/basic/role/menus/?rid=${roleId}`;
        if (selectedKeys.length === 0) {
          url = `/system/basic/role/menus/?rid=${roleId}&mids`;
        } else {
          selectedKeys.forEach(key => {
            url += "&mids=" + key;
          });
        }
        this.putRequest(url).then(response => {
          if (response.code === 200) {
            this.activeName = -1;
            this.$message.success("更新成功！");
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //取消更新
      cancelUpdate() {
        this.activeName = -1;
      },
      //添加角色
      doAddRole() {
        if (this.role.name && this.role.nameZh) {
          this.postRequest("/system/basic/role/", this.role).then(response => {
            if (response.code === 200) {
              this.initRoles();
              this.role.name = "";
              this.role.nameZh = "";
              this.$message.success("添加成功");
            } else {
              this.$message.error(response.message);
            }
          });
        } else {
          this.$message.error("所有字段不得为空");
        }
      },
      //删除角色
      doDeleteRole(role) {
        this.$confirm("此操作将永久删除[" + role.nameZh + "]职称, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //请求删除职位接口
          this.deleteRequest(`/system/basic/role/${role.id}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.$message.success("删除成功");
              //刷新职位列表
              this.initRoles();
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
      }
    }
  };
</script>

<style scoped>
    .permissionManaTool {
        display: flex;
        justify-content: flex-start;
    }

    .permissionManaMain {
        margin-top: 10px;
        width: 700px;
    }

    .permissionManaTool .el-input {
        width: 300px;
        margin-right: 6px;
    }
</style>