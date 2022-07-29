<template>
    <div style="width: 500px;">
        <el-input
                placeholder="输入部门名称进行搜索"
                prefix-icon="el-icon-search"
                v-model="filterText">
        </el-input>

        <el-tree
                :data="departments"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                ref="tree">
          <span class="custom-tree-node" style="display: flex; width:100%; justify-content: space-between"
                slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                      type="primary"
                      size="mini"
                      class="depBtn"
                      @click="() => showAddDepartment(data)">
                添加部门
              </el-button>
              <el-button
                      type="danger"
                      size="mini"
                      class="depBtn"
                      @click="() => deleteDepartment(data)">
                删除部门
              </el-button>
            </span>
          </span>
        </el-tree>
        <el-dialog
                title="添加部门"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>
                            <span style="margin-left: 6px;">{{SupDepName}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>部门名称</el-tag>
                        </td>
                        <td>
                            <el-input style="margin-left: 6px;" v-model="department.name"
                                      placeholder="请输入部门名称"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDepartment">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "DepMana",
    data() {
      return {
        //搜索框中的内容
        filterText: "",
        //存放所有的部门
        departments: [],
        //默认展示的属性
        defaultProps: {
          children: "children",
          label: "name"
        },
        //对话框是否显示
        dialogVisible: false,
        //添加的部门名称和id
        department: {
          id: -1,
          name: "",
          parentId: -1
        },
        //上级部门的名称
        SupDepName: "",
        //添加部门时，点击的部门的父部门信息
        pData: {},
      };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      this.initDepartments();
    },
    methods: {
      //初始部门信息
      initDepartments() {
        this.getRequest("/employee/basic/department/").then(response => {
          if (response.code === 200) {
            this.departments = response.data;
          } else {
            this.$message.error(response.message);
          }
        });
      },
      //置空添加框中的输入数据
      initDep() {
        this.department = {
          name: "",
          parentId: -1
        };
        this.SupDepName = "";
      },
      //将新加入的部门展示在树形控件上，不用刷新整个部门功能
      addDepToDeps(departments, department) {
        for (let i = 0; i < departments.length; i++) {
          let d = departments[i];
          if (d.id === departments.parentId) {
            if (d.children === null) d.children = [];
            d.children = d.children.concat(department);
            return;
          } else {
            this.addDepToDeps(d.children, department);
          }
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      //展示添加部门编辑框
      showAddDepartment(data) {
        this.pData = data;
        this.dialogVisible = true;
        this.department.parentId = data.id;
        //绑定上级部门的名称
        this.SupDepName = data.name;
      },
      //添加部门
      doAddDepartment() {
        this.postRequest("/employee/basic/department/", this.department).then(response => {
          /*let obj = {
            id: this.department.id,
            name: this.department.name,
            parentId: this.department.parentId,
            depPath: null,
            enabled: true,
            isParent: null,
            children: null,
            result: 1
          };*/
          if (response.code === 200) {
            //添加成功时应返回的数据
            this.$message.success("添加成功！");
            /*
            * 此处由于接口返回数据不对，无法实现添加部门之后，不刷新整个部门
            * 暂时使用initDepartments()实现刷新
            * 使用initDep()实现添加之后输入框置空
            * addDepToDeps(this.departments,response.obj)暂时无法实现
            * */
            // this.addDepToDeps(this.departments, obj);
            this.initDepartments();
            this.initDep();
            this.dialogVisible = false;
          } else {
            this.$message.error("添加失败");
          }
        });
      },
      //手动刷新整个部门列表
      removeDepartmentFromDepartments(p, deps, id) {
        for (let i = 0; i < deps.length; i++) {
          let d = deps[i];
          if (d.id === id) {
            deps.splice(i, 1);
            if (deps.length === 0) {
              p.isParent = false;
            }
            return;
          } else {
            this.removeDepartmentFromDepartments(d, d.children, id);
          }
        }
      },
      //删除部门
      deleteDepartment(data) {
        //如果要删除的是父部门
        if (data.isParent) {
          this.$message.error("父部门删除失败！");
        } else {
          this.$confirm("此操作将永久删除[" + data.name + "]部门, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            //请求删除职位接口
            this.deleteRequest(`/employee/basic/department/${data.id}`).then((response) => {
              //如果请求删除成功
              if (response.code === 200) {
                this.$message.success("删除成功");
                this.removeDepartmentFromDepartments(null, this.departments, data.id);
                //刷新职位列表
                // this.initDepartments();
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
      },
    }
  };
</script>

<style scoped>
    .depBtn {
        padding: 2px;
    }
</style>