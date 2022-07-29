<template>
    <div>
        <div style="display: flex;justify-content: space-between;">
            <el-button type="primary" icon="el-icon-plus" @click="showAddSalDialog">添加工资账套</el-button>
            <el-button type="success" icon="el-icon-refresh" @click="initSalaries"/>
        </div>
        <div style="margin-top: 8px;">
            <el-table
                    :data="salaries"
                    height="500"
                    border
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    stripe>
                <el-table-column
                        type="selection"
                        width="40">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="账套名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="basicSalary"
                        label="基本工资"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="trafficSalary"
                        label="交通补助"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="lunchSalary"
                        label="午餐补助"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="bonus"
                        label="奖金"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="启用时间"
                        width="100">
                </el-table-column>
                <el-table-column
                        label="养老金"
                        align="center">
                    <el-table-column
                            prop="pensionPer"
                            label="比率"
                            width="70">
                    </el-table-column>
                    <el-table-column
                            prop="pensionBase"
                            label="基数"
                            width="70">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                        label="医疗保险"
                        align="center">
                    <el-table-column
                            prop="medicalPer"
                            label="比率"
                            width="70">
                    </el-table-column>
                    <el-table-column
                            prop="medicalBase"
                            label="基数"
                            width="70">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                        label="公积金"
                        align="center">
                    <el-table-column
                            prop="accumulationFundPer"
                            label="比率"
                            width="70">
                    </el-table-column>
                    <el-table-column
                            prop="accumulationFundBase"
                            label="基数"
                            width="70">
                    </el-table-column>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="showEditSalaryView(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteSalary(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="50%">
            <div style="display: flex;justify-content: space-around;align-items: center">
                <el-steps direction="vertical" :active="activeItemIndex">
                    <el-step :title="item" v-for="(item,index) in salaryItem" :key="index"></el-step>
                </el-steps>
                <el-input :placeholder="'请输入'+salaryItem[index]" v-model="salary[title]"
                          v-for="(value,title,index) in salary"
                          :key="index"
                          v-show="activeItemIndex === index"
                          style="width: 200px;"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="preStep">{{activeItemIndex === salaryItem.length-1 ?"取消":"上一步"}}</el-button>
                <el-button type="primary"
                           @click="nextStep">{{activeItemIndex === salaryItem.length-1 ?"确定":"下一步"}}</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "SalSob",
    data() {
      return {
        salaries: [],
        dialogVisible: false,
        dialogTitle: "添加工资账套",
        activeItemIndex: 0,
        salaryItem: [
          "账套名称",
          "基本工资",
          "交通补助",
          "午餐补助",
          "奖金",
          "养老金基数",
          "养老金比率",
          "医疗保险基数",
          "医疗保险比率",
          "公积金基数",
          "公积金比率",

        ],
        salary: {
          name: "",
          basicSalary: 0,
          trafficSalary: 0,
          lunchSalary: 0,
          bonus: 0,
          pensionBase: 0,
          pensionPer: 0,
          medicalBase: 0,
          medicalPer: 0,
          accumulationFundBase: 0,
          accumulationFundPer: 0,
        },
        loading: true,
      };
    },
    mounted() {
      this.initSalaries();
    },
    methods: {
      initSalaries() {
        this.getRequest("/salary/sob/").then(resp => {
          if (resp.code === 200) {
            this.salaries = resp.data;
            this.loading = false;
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      showAddSalDialog() {
        this.dialogTitle = "添加工资账套";
        this.activeItemIndex = 0;
        this.dialogVisible = true;
        this.salary = {
          name: "",
          basicSalary: 0,
          trafficSalary: 0,
          lunchSalary: 0,
          bonus: 0,
          pensionBase: 0,
          pensionPer: 0,
          medicalBase: 0,
          medicalPer: 0,
          accumulationFundBase: 0,
          accumulationFundPer: 0,
        };
      },
      showEditSalaryView(data) {
        this.dialogTitle = "编辑工资账套";
        this.dialogVisible = true;
        this.activeItemIndex = 0;
        this.salary.id = data.id;
        this.salary.name = data.name;
        this.salary.basicSalary = data.basicSalary;
        this.salary.trafficSalary = data.trafficSalary;
        this.salary.lunchSalary = data.lunchSalary;
        this.salary.bonus = data.bonus;
        this.salary.pensionBase = data.pensionBase;
        this.salary.pensionPer = data.pensionPer;
        this.salary.medicalBase = data.medicalBase;
        this.salary.medicalPer = data.medicalPer;
        this.salary.accumulationFundBase = data.accumulationFundBase;
        this.salary.accumulationFundPer = data.accumulationFundPer;
      },
      //上一步
      preStep() {
        if (this.activeItemIndex === 0) {
          return;
        } else if (this.activeItemIndex === this.salaryItem.length - 1) {
          this.dialogVisible = false;
          return;
        }
        this.activeItemIndex--;
      },
      //下一步
      nextStep() {
        if (this.activeItemIndex === this.salaryItem.length - 1) {
          if (this.salary.id) {
            this.putRequest("/salary/sob/", this.salary).then(resp => {
                if (resp.code === 200) {
                  this.dialogVisible = false;
                  this.initSalaries();
                  this.$message.success("更新成功");
                } else {
                  this.$message.error(resp.message);
                }
              }
            );
          } else {
            this.postRequest("/salary/sob/", this.salary).then(resp => {
              if (resp.code === 200) {
                this.dialogVisible = false;
                this.initSalaries();
                this.$message.success("添加成功");
              } else {
                this.$message.error(resp.message);
              }
            });
          }
          return;
        }
        this.activeItemIndex++;
      },
      //删除工资账套
      deleteSalary(data) {
        this.$confirm("此操作将永久删除[" + data.name + "]工资账套, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //请求删除职位接口
          this.deleteRequest(`/salary/sob/${data.id}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.$message.success("删除成功");
              //刷新职位列表
              this.initSalaries();
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
  };
</script>

<style scoped>

</style>