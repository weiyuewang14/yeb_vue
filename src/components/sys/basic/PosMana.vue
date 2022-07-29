<template>
    <div>
        <div>
            <el-input
                    size="small"
                    class="addPosInput"
                    placeholder="添加职位"
                    @keydown.enter.native="addPosition"
                    suffix-icon="el-icon-plus"
                    v-model="pos.name">
            </el-input>
            <el-button size="small" type="primary" icon="el-icon-edit" @click="addPosition">添加</el-button>
        </div>
        <div class="posManaMain">
            <el-table
                    size="small"
                    :data="positions"
                    stripe
                    border
                    @selection-change="handleSelectionChange"
                    style="width: 70%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="200">
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
        </div>
        <el-button size="small" style="margin-top: 8px;" type="danger" :disabled="multipleSelection.length ===0"
                   @click="deletePositions">批量删除
        </el-button>
        <el-dialog
                title="编辑职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                <el-input size="small" v-model="updatePos.name" class="updatePosInput"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "PosMana",
    data() {
      return {
        //添加职位的输入框绑定的数据
        pos: {
          name: ""
        },
        //所有职位信息
        positions: [],
        //编辑职位的弹出框是否展示
        dialogVisible: false,
        //更新职位的信息
        updatePos: {
          name: ""
        },
        //存放更新职位前的职位名称，用来判断是否更改了职位名称
        odlPosName: "",
        //存放批量删除的职位
        multipleSelection: []
      };
    },
    mounted() {
      this.initPositions();
    },
    methods: {
      //调用接口获取职位信息
      initPositions() {
        this.getRequest("/system/basic/position/").then(response => {
          if (response.code === 200) {
            this.positions = response.data;
          }
        });
      },
      //添加职位
      addPosition() {
        //判断当前添加的职位是否存在
        //如果职位存在
        if (this.pos.name) {
          //调用接口添加职位
          this.postRequest("/system/basic/position/", this.pos).then((response) => {
            if (response.code === 200) {
              this.initPositions();
              this.$message.success("添加成功！");
              this.pos.name = "";
            } else {
              this.pos.name = "";
              this.$message.error("已有该职位");
            }
          });
        } else {
          this.$message.error("职位名称不能为空！");
        }
      },
      //点击编辑，展示编辑框
      showEditView(index, data) {
        //先展示要编辑的职位名称
        Object.assign(this.updatePos, data);
        this.odlPosName = this.updatePos.name;
        this.updatePos.createDate = "";
        //显示编辑框
        this.dialogVisible = true;
      },
      //更新职位名称
      doUpdate() {
        //如果输入的职位名称和之前的一样。该怎么解决？
        if (this.updatePos.name === this.odlPosName) {
          //直接关闭编辑框
          this.dialogVisible = false;
        }
        // 如果职位更改了，发送请求更新
        else {
          this.putRequest("/system/basic/position/", this.updatePos).then((response) => {
            if (response.code === 200) {
              this.dialogVisible = false;
              this.initPositions();
              this.$message.success("更新职位成功");
            } else {
              this.$message.error("更新职位失败");
            }
          });
        }
      },
      //删除一个职位
      handleDelete(index, data) {
        this.$confirm("此操作将永久删除[" + data.name + "]职位, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //请求删除职位接口
          this.deleteRequest(`/system/basic/position/${data.id}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.$message.success("删除成功");
              //刷新职位列表
              this.initPositions();
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
      //选择多个职位
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //删除多个职位
      deletePositions() {
        this.$confirm("此操作将永久删除[" + this.multipleSelection.length + "]个职位, 是否继续?", "提示", {
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
          //请求删除职位接口
          this.deleteRequest(`/system/basic/position/${ids}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.$message.success("删除成功");
              //刷新职位列表
              this.initPositions();
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
    .addPosInput {
        width: 300px;
        margin-right: 8px;
    }

    .updatePosInput {
        width: 200px;
        margin-left: 8px;
    }

    .posManaMain {
        margin-top: 10px;
    }
</style>