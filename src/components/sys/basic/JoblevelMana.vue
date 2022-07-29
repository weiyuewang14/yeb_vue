<template>
    <div>
        <div>
            <el-input size="small" v-model="jobLevel.name" placeholder="添加职称"
                      prefix-icon="el-icon-plus"
                      style="width: 300px;"></el-input>
            <el-select size="small" v-model="jobLevel.titleLevel" style="margin-left: 6px;margin-right: 6px;"
                       placeholder="职称等级">
                <el-option
                        v-for="item in titleLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobLevel">添加</el-button>

        </div>
        <div style="margin-top: 5px;">
            <el-table
                    :data="jobLevels"
                    stripe
                    border
                    size="small"
                    style="width: 70%"
                    @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"/>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称等级"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="是否启用"
                        width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="showEditView(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button size="small" style="margin-top: 10px;" type="danger"
                       :disabled="this.multipleSelection.length===0" @click="deleteJobLevels">
                批量删除
            </el-button>
        </div>
        <el-dialog
                title="编辑职称"
                :visible.sync="dialogVisible"
                width="30%">
            <table>
                <tr>
                    <td>
                        <el-tag>职称名称</el-tag>
                    </td>
                    <td>
                        <el-input size="small" v-model="updateJobLevel.name" style="margin-left: 6px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>职称等级</el-tag>
                    </td>
                    <td>
                        <el-select size="small" v-model="updateJobLevel.titleLevel" style="margin-left: 6px;"
                                   placeholder="职称等级">
                            <el-option
                                    v-for="item in titleLevels"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <el-tag>是否启用</el-tag>
                    </td>
                    <td>
                        <el-switch
                                style="margin-left: 6px;"
                                v-model="updateJobLevel.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="已启用"
                                inactive-text="未启用">
                        </el-switch>
                    </td>
                </tr>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "JoblevelMana",
    data() {
      return {
        //存放添加职称和职称等级的信息
        jobLevel: {
          name: "",
          titleLevel: ""
        },
        //存放下拉框中的职称等级
        titleLevels: [
          "正高级", "副高级", "中级", "初级", "员级"
        ],
        //展示所有的职称信息
        jobLevels: [],
        dialogVisible: false,
        //更新职称等级的信息
        updateJobLevel: {
          id: "",
          name: "",
          titleLevel: "",
          enabled: false,
        },
        //更新之前所选择的职称等级的信息
        oldJobLevel: {
          name: "",
          titleLevel: "",
          enabled: false
        },
        multipleSelection: [],
      };
    },
    mounted() {
      this.initJobLevels();
    },
    methods: {
      //展示所有职称
      initJobLevels() {
        this.getRequest("/system/basic/joblevel/").then(response => {
          if (response.code === 200) {
            this.jobLevels = response.data;
            //置空添加框
            this.jobLevel.name = "";
            this.jobLevel.titleLevel = "";
          }
        });
      },
      //添加职称等级
      addJobLevel() {
        //先判断职称名称和职称等级是否存在
        if (this.jobLevel.name && this.jobLevel.titleLevel) {
          //当前添加的职称是否存在，若存在则不添加
          let flag = false;
          this.jobLevels.forEach(item => {
            if (item.name === this.jobLevel.name) {
              flag = true;
              return;
            }
          });
          if (flag) {
            this.jobLevel.name = "";
            this.jobLevel.titleLevel = "";
            this.$message.error("已有该职称,请勿重复添加！");
          } else {
            this.postRequest("/system/basic/joblevel/", this.jobLevel).then(response => {
              if (response.code === 200) {
                this.initJobLevels();
                this.$message.success("添加成功");
              } else {
                this.$message.error(response.message);
              }
            });
          }
        }
        //如果没输入
        else {
          this.$message.error("请输入职称或选择职称等级！");
        }
      },
      //删除当前职位
      handleDelete(index, data) {
        this.$confirm("此操作将永久删除[" + data.name + "]职称, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //请求删除职位接口
          this.deleteRequest(`/system/basic/joblevel/${data.id}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.$message.success("删除成功");
              //刷新职位列表
              this.initJobLevels();
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
      //展示编辑职称的对话框
      showEditView(index, data) {
        //复制之前的信息
        Object.assign(this.updateJobLevel, data);
        this.updateJobLevel.createDate = "";
        //保存编辑之前的职称名称、职称等级、是否启用
        Object.assign(this.oldJobLevel, data);
        //打开对话框
        this.dialogVisible = true;
      },
      //更新职称
      doUpdate() {
        //如果都没有更改，但是点了确定，则直接关闭编辑框
        if (this.oldJobLevel.name === this.updateJobLevel.name && this.oldJobLevel.titleLevel === this.updateJobLevel.titleLevel && this.oldJobLevel.enabled === this.updateJobLevel.enabled) {
          //直接关闭编辑框
          this.dialogVisible = false;
        } else {
          this.putRequest("/system/basic/joblevel/", this.updateJobLevel).then(response => {
            if (response.code === 200) {
              this.initJobLevels();
              this.dialogVisible = false;
              this.$message.success("更新成功");
            } else {
              this.$message.error("更新失败");
            }
          });
        }
      },
      //选择多个职称
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //批量删除
      deleteJobLevels() {
        this.$confirm("此操作将永久删除[" + this.multipleSelection.length + "]个职称, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //存放多个职位的id
          let ids = "?";
          //遍历所有职位
          this.multipleSelection.forEach(item => {
            ids += "ids=" + item.id + "&";
          });
          /*//请求删除多个职位接口，接口没写
          this.deleteRequest(`/system/basic/joblevel/${ids}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.$message.success("删除成功");
              //刷新职称列表
              this.initJobLevels();
            } else {
              this.$message.error("删除失败");
            }
          });*/
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

</style>