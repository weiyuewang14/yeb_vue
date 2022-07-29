<template>
    <div>
        <el-table
                :data="employees"
                height="500"
                border
                stripe>
            <el-table-column
                    type="selection"
                    width="40">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="name"
                    label="姓名"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="workID"
                    label="工号"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="电子邮件"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号码"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="department.name"
                    label="部门名称"
                    width="120">
            </el-table-column>
            <el-table-column
                    label="工资账套"
                    align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right" v-if="scope.row.salary">
                        <div slot="content">
                            <table>
                                <tr>
                                    <td>基本工资</td>
                                    <td>{{scope.row.salary.basicSalary}}</td>
                                </tr>
                                <tr>
                                    <td>交通补助</td>
                                    <td>{{scope.row.salary.trafficSalary}}</td>
                                </tr>
                                <tr>
                                    <td>午餐补助</td>
                                    <td>{{scope.row.salary.lunchSalary}}</td>
                                </tr>
                                <tr>
                                    <td>奖金</td>
                                    <td>{{scope.row.salary.bonus}}</td>
                                </tr>
                                <tr>
                                    <td>养老金基数</td>
                                    <td>{{scope.row.salary.pensionBase}}</td>
                                </tr>
                                <tr>
                                    <td>养老金比率</td>
                                    <td>{{scope.row.salary.pensionPer}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险基数</td>
                                    <td>{{scope.row.salary.medicalBase}}</td>
                                </tr>
                                <tr>
                                    <td>医疗保险比率</td>
                                    <td>{{scope.row.salary.medicalPer}}</td>
                                </tr>
                                <tr>
                                    <td>公积金基数</td>
                                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                                </tr>
                                <tr>
                                    <td>公积金比率</td>
                                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                                </tr>
                            </table>
                        </div>
                        <el-tag type="success">{{scope.row.salary.name}}</el-tag>
                    </el-tooltip>
                    <el-tag type="success" v-else>暂未设置</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center">
                <template slot-scope="scope">
                    <el-popover
                            placement="bottom"
                            title="修改工资账套"
                            @show="showPop(scope.row.salary)"
                            @hide="updateSalary(scope.row)"
                            width="250"
                            trigger="click">
                        <div>
                            <el-select v-model="currentSalaryId" size="mini" style="width: 200px;"
                                       placeholder="请选择">
                                <el-option
                                        v-for="item in salaries"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button slot="reference" type="danger">修改工资账套</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <!--分页器-->
        <div style="display: flex;justify-content: center;padding: 5px;">
            <el-pagination
                    background
                    @current-change="currentPageChange"
                    @size-change="sizeChange"
                    layout="sizes, prev, pager, next, jumper, ->, total"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
  export default {
    name: "SalSobCfg",
    data() {
      return {
        employees: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        salaries: [],
        currentSalaryId: null
      };
    },
    mounted() {
      this.initEmployees();
      this.getSalaries();
    },
    methods: {
      initEmployees() {
        this.getRequest(`/salary/sobcfg/?currentPage=${this.currentPage}&pageSize=${this.pageSize}`).then(resp => {
          if (resp.code === 200) {
            this.employees = resp.data.data;
            this.total = resp.data.total;
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      //展示点击当前页的数据
      currentPageChange(currentPage) {
        this.currentPage = currentPage;
        this.initEmployees();
      },
      //修改每页多少条数据
      sizeChange(sizeChange) {
        this.pageSize = sizeChange;
        this.initEmployees();
      },
      //获取所有工资账套
      getSalaries() {
        this.getRequest("/salary/sobcfg/salaries").then(resp => {
          if (resp.code === 200) {
            this.salaries = resp.data;
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      showPop(data) {
        if (data) {
          this.currentSalaryId = data.id;
        } else {
          this.currentSalaryId = null;
        }
      },
      updateSalary(data) {
        if (this.currentSalaryId && this.currentSalaryId !== data.salary.id) {
          this.putRequest(`/salary/sobcfg/?eId=${data.id}&sId=${this.currentSalaryId}`).then(resp => {
            if (resp.code === 200) {
              this.initEmployees();
              this.$message.success('修改成功')
            } else {
              this.$message.error(resp.message);
            }
          });
        }
      }
    }
  };
</script>

<style scoped>

</style>