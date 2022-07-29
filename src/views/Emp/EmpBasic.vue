<template>
    <div>
        <!--顶部操作-->
        <div style="display: flex;justify-content: space-between;">
            <!--搜索框-->
            <div>
                <el-input :disabled="showAdvanceSearchVisible" clearable @clear="initEmployees" v-model="employeeName"
                          @keydown.enter.native="initEmployees"
                          style="width: 300px; margin-right: 6px;" prefix-icon="el-icon-search"
                          placeholder="请输入员工姓名进行搜索"></el-input>
                <el-button :disabled="showAdvanceSearchVisible" type="primary" icon="el-icon-search"
                           @click="initEmployees">搜素
                </el-button>
                <el-button type="primary" @click="advanceSearchShow">
                    <i :class="showAdvanceSearchVisible ?'fa fa-angle-double-up' : 'fa fa-angle-double-down'"
                       aria-hidden="true"></i>
                    高级搜索
                </el-button>
            </div>
            <!--导入|导出|添加员工-->
            <div style="padding: 8px;">
                <el-upload
                        style="display: inline-flex;margin-right: 8px;"
                        :headers="headers"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-success="successUpload"
                        :on-error="errorUpload"
                        :disabled="importDataDisabled"
                        action="/employee/basic/import">
                    <!--action="/employee/basic/import",后端接口地址，由于接口未写，暂时无法实现-->
                    <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">
                        {{importDataBtnText}}
                    </el-button>
                    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
                </el-upload>
                <el-button type="success" icon="el-icon-download" @click="exportData">
                    导出数据
                </el-button>
                <el-button type="primary" icon="el-icon-plus" @click="showAddEmployee">
                    添加员工
                </el-button>
            </div>
        </div>
        <transition name="slide-fade">
            <div v-show="showAdvanceSearchVisible"
                 style="border: 1px solid #409eff;border-radius:5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
                <el-row>
                    <el-col :span="5">
                        政治面貌：
                        <el-select v-model="advanceSearchValue.politicId" size="mini" style="width: 130px;"
                                   placeholder="政治面貌">
                            <el-option
                                    v-for="item in politicStatus"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        民族：
                        <el-select v-model="advanceSearchValue.nationId" size="mini" style="width: 130px;"
                                   placeholder="民族">
                            <el-option
                                    v-for="item in nations"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        职位：
                        <el-select v-model="advanceSearchValue.posId" size="mini" style="width: 130px;"
                                   placeholder="职位">
                            <el-option
                                    v-for="item in positions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        职称：
                        <el-select v-model="advanceSearchValue.jobLevelId" size="mini" style="width: 130px;"
                                   placeholder="职称">
                            <el-option
                                    v-for="item in joblevels"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="7">
                        聘用形式
                        <el-radio-group v-model="advanceSearchValue.engageForm">
                            <el-radio label="劳动合同">劳动合同</el-radio>
                            <el-radio label="劳务合同">劳务合同</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 8px;">
                    <el-col :span="5">
                        所属部门：
                        <el-popover
                                placement="bottom"
                                title="请选择部门"
                                width="250"
                                trigger="manual"
                                v-model="visible2">
                            <el-tree :data="allDepartments" :props="defaultProps"
                                     @node-click="advanceSearchHandleNodeClick"></el-tree>
                            <div style="font-size:14px;align-items:center; padding-left: 12px;width: 130px;
                                                display: inline-flex;border-radius: 4px;border: 1px solid #DCDFE6;
                                                height: 25px;cursor:pointer; box-sizing:border-box;"
                                 @click="showDepView2"
                                 slot="reference">{{inputDepName}}
                            </div>
                        </el-popover>
                    </el-col>
                    <el-col :span="10">
                        入职日期：
                        <el-date-picker
                                v-model="advanceSearchValue.beginDateScope"
                                type="daterange"
                                size="mini"
                                align="center"
                                unlink-panels
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="5" :offset="4">
                        <el-button size="mini" type="cancel">取消</el-button>
                        <el-button size="mini" icon="el-icon-search" type="primary"
                                   @click="initEmployees('advanceSearch')">搜索
                        </el-button>
                    </el-col>
                </el-row>
            </div>
        </transition>
        <!--表格，数据展示-->
        <div style="margin-top: 6px;">
            <!--员工信息展示表格-->
            <el-table
                    :data="employees"
                    height="500px"
                    border
                    stripe
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
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
                        prop="joblevel.name"
                        label="职称"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="position.name"
                        label="职位"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="gender"
                        label="性别"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="politicsStatus.name"
                        label="政治面貌"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="nation.name"
                        label="民族"
                        width="60">
                </el-table-column>
                <el-table-column
                        prop="birthday"
                        label="出生日期"
                        width="95">
                </el-table-column>
                <el-table-column
                        prop="idCard"
                        label="身份证号码"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="wedlock"
                        label="婚姻状况"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="电子邮件"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="手机号码"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="地址"
                        width="300">
                </el-table-column>
                <el-table-column
                        prop="department.name"
                        label="所属部门"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="engageForm"
                        label="聘用形式"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="tiptopDegree"
                        label="最高学历"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="school"
                        label="毕业院校"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="specialty"
                        label="专业"
                        width="130">
                </el-table-column>
                <el-table-column
                        prop="workState"
                        label="在职状态"
                        width="70">
                </el-table-column>
                <el-table-column
                        prop="beginDate"
                        label="入职日期"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="conversionTime"
                        label="转正日期"
                        width="90">
                </el-table-column>
                <el-table-column
                        prop="beginContract"
                        label="合同起始日期"
                        width="95">
                </el-table-column>
                <el-table-column
                        label="合同期限"
                        width="90">
                    <template slot-scope="scope">
                        <el-tag>{{scope.row.contractTerm}}</el-tag>
                        年
                    </template>
                </el-table-column>
                <el-table-column
                        prop="endContract"
                        label="合同截止日期"
                        width="95">
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        width="200">
                    <template slot-scope="scope">
                        <el-button style="padding: 2px" size="mini" @click="showEditEmpView(scope.row)">编辑</el-button>
                        <el-button style="padding: 2px" size="mini" type="primary">查看高级资料</el-button>
                        <el-button style="padding: 2px" size="mini" type="danger" @click="deleteEmployee(scope.row)">
                            删除
                        </el-button>
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
        <!--添加员工对话框-->
        <el-dialog
                :title="title"
                :visible.sync="dialogVisible"
                width="70%">
            <div>
                <el-form ref="empForm" :model="employee" :rules="rules">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="姓名:" prop="name">
                                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 150px;"
                                          v-model="employee.name" placeholder="请输入员工姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="性别:" prop="gender">
                                <el-radio-group v-model="employee.gender" style="margin-top: 8px;">
                                    <el-radio label="男">男</el-radio>
                                    <el-radio label="女">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="出生日期:" prop="birthday">
                                <el-date-picker
                                        v-model="employee.birthday"
                                        type="date"
                                        style="width: 200px;"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="出生日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="政治面貌:" prop="politicId">
                                <el-select v-model="employee.politicId" size="mini" style="width: 200px;"
                                           placeholder="政治面貌">
                                    <el-option
                                            v-for="item in politicStatus"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="民族:" prop="nationId">
                                <el-select v-model="employee.nationId" size="mini" style="width: 150px;"
                                           placeholder="民族">
                                    <el-option
                                            v-for="item in nations"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="籍贯:" prop="nativePlace">
                                <el-input v-model="employee.nativePlace" placeholder="请输入籍贯"
                                          size="mini" style="width: 150px;" prefix-icon="el-icon-edit"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="电子邮箱:" prop="email">
                                <el-input v-model="employee.email" placeholder="请输入邮箱"
                                          size="mini" style="width: 200px;" prefix-icon="el-icon-message"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="联系地址:" prop="address">
                                <el-input v-model="employee.address" size="mini" style="width: 200px;"
                                          placeholder="请输入联系地址">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="职位:" prop="posId">
                                <el-select v-model="employee.posId" size="mini" style="width: 150px;"
                                           placeholder="职位">
                                    <el-option
                                            v-for="item in positions"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="职称:" prop="jobLevelId">
                                <el-select v-model="employee.jobLevelId" size="mini" style="width: 150px;"
                                           placeholder="职称">
                                    <el-option
                                            v-for="item in joblevels"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="所属部门:" prop="departmentId">
                                <el-popover
                                        placement="bottom"
                                        title="请选择部门"
                                        width="250"
                                        trigger="manual"
                                        v-model="visible">
                                    <el-tree :data="allDepartments" :props="defaultProps"
                                             @node-click="handleNodeClick"></el-tree>
                                    <div style="font-size:14px;align-items:center; padding-left: 12px;width: 200px;
                                                display: inline-flex;border-radius: 4px;border: 1px solid #DCDFE6;
                                                height: 25px;cursor:pointer; box-sizing:border-box;"
                                         @click="showDepView"
                                         slot="reference">{{inputDepName}}
                                    </div>
                                </el-popover>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="电话号码:" prop="phone">
                                <el-input v-model="employee.phone" placeholder="请输入电话号码" size="mini"
                                          style="width: 200px;" prefix-icon="el-icon-phone"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="工 号:" prop="workID">
                                <el-input v-model="employee.workID" disabled palceholder="请输入工号"
                                          prefix-icon="el-icon-edit"
                                          size="mini" style="width: 150px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="学历:" prop="tiptopDegree">
                                <el-select v-model="employee.tiptopDegree" size="mini" style="width: 150px;"
                                           placeholder="学历">
                                    <el-option
                                            v-for="item in tiptopDegree"
                                            :key="item"
                                            :label="item"
                                            :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="毕业院校:" prop="school">
                                <el-input v-model="employee.school" palceholder="请输入学校名称" prefix-icon="el-icon-edit"
                                          size="mini" style="width: 200px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="专业名称:" prop="specialty">
                                <el-input v-model="employee.specialty" placeholder="请输入专业名称" size="mini"
                                          style="width: 200px;" prefix-icon="el-icon-edit"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="入职日期:" prop="beginDate">
                                <el-date-picker
                                        v-model="employee.beginDate"
                                        type="date"
                                        style="width: 123px;"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="入职日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="转正日期:" prop="conversionTime">
                                <el-date-picker
                                        v-model="employee.conversionTime"
                                        type="date"
                                        style="width: 123px;"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="转正日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label="合同起始日期:" prop="beginContract">
                                <el-date-picker
                                        v-model="employee.beginContract"
                                        type="date"
                                        style="width: 173px;"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="合同起始日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="合同截止日期:" prop="endContract">
                                <el-date-picker
                                        v-model="employee.endContract"
                                        type="date"
                                        style="width: 173px;"
                                        size="mini"
                                        value-format="yyyy-MM-dd"
                                        placeholder="合同截止日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="身份证号码:" prop="idCard">
                                <el-input size="mini" prefix-icon="el-icon-edit" style="width: 180px;"
                                          v-model="employee.idCard" placeholder="请输入身份号码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="聘用形式:" prop="engageForm">
                                <el-radio-group v-model="employee.engageForm" style="margin-top: 8px;">
                                    <el-radio label="劳动合同">劳动合同</el-radio>
                                    <el-radio label="劳务合同">劳务合同</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="婚姻状况:" prop="wedlock">
                                <el-radio-group v-model="employee.wedlock" style="margin-top: 8px;">
                                    <el-radio label="未婚">未婚</el-radio>
                                    <el-radio label="已婚">已婚</el-radio>
                                    <el-radio label="离异">离异</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddEmployee">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "EmpBasic",
    data() {
      return {
        //高级搜索传入的参数
        advanceSearchValue: {
          politicId: null,
          nationId: null,
          posId: null,
          jobLevelId: null,
          engageForm: "",
          departmentId: null,
          beginDateScope: null
        },
        //是否展示高级搜索
        showAdvanceSearchVisible: false,
        //高级搜索》入职日期
        pickerOptions: {
          shortcuts: [{
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }, {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }]
        },
        //导入员工信息
        importDataBtnText: "导入数据",
        importDataBtnIcon: "el-icon-upload2",
        importDataDisabled: false,
        headers: {
          Authorization: window.sessionStorage.getItem("tokenStr")
        },
        //所有员工信息
        employees: [],
        //总共的员工人数
        total: 0,
        //加载
        loading: false,
        //当前页
        currentPage: 1,
        //每页展示的条数
        pageSize: 10,
        //员工姓名
        employeeName: "",
        //添加员工时的弹出框
        dialogVisible: false,
        //员工信息
        employee: {
          id: null,
          name: "",
          gender: "",
          birthday: "",
          idCard: "",
          wedlock: "",
          nationId: null,
          nativePlace: "",
          politicId: null,
          email: "",
          phone: "",
          address: "",
          departmentId: null,
          jobLevelId: null,
          posId: null,
          engageForm: "",
          tiptopDegree: "",
          specialty: "",
          school: "",
          beginDate: "",
          workState: "在职",
          workID: "",
          contractTerm: null,
          conversionTime: "",
          notWorkDate: null,
          beginContract: "",
          endContract: "",
          workAge: null,
          salaryId: null,
        },
        //民族
        nations: [],
        //职称
        joblevels: [],
        //政治面貌
        politicStatus: [],
        //职位
        positions: [],
        //学位
        tiptopDegree: ["博士", "硕士", "本科", "大专", "高中", "初中", "小学", "其他"],
        defaultProps: {
          children: "children",
          value: "id",
          label: "name"
        },
        //所有部门
        allDepartments: [],
        //添加员工中的tree树形控件是否展示
        visible: false,
        //高级搜索中的tree树形控件是否展示
        visible2: false,
        //对话框标题
        title: "",
        //添加员工中的输入员工部门名称
        inputDepName: "",
        //表单校验
        rules: {
          name: [{required: true, message: "请输入员工姓名", trigger: "blur"}],
          gender: [{required: true, message: "请输入员工性别", trigger: "blur"}],
          birthday: [{required: true, message: "请输入出生日期", trigger: "blur"}],
          idCard: [{required: true, message: "请输入身份证号码", trigger: "blur"}, {
            pattern: /^[1-8][1-7]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/,
            message: "身份证号码格式不正确",
            trigger: "blur"
          }],
          wedlock: [{required: true, message: "请输婚姻状况", trigger: "blur"}],
          nationId: [{required: true, message: "请输入民族", trigger: "blur"}],
          nativePlace: [{required: true, message: "请输入籍贯", trigger: "blur"}],
          politicId: [{required: true, message: "请输入政治面貌", trigger: "blur"}],
          email: [{required: true, message: "请输入邮箱地址", trigger: "blur"}, {
            type: "email",
            message: "邮箱地址格式不正确",
            trigger: "blur"
          }],
          phone: [{required: true, message: "请输入手机号码", trigger: "blur"}, {
            pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
            message: "手机号码格式不正确",
            trigger: "blur"
          }],
          address: [{required: true, message: "请输入员工地址", trigger: "blur"}],
          departmentId: [{required: true, message: "请输入员工所属部门", trigger: "blur"}],
          jobLevelId: [{required: true, message: "请输入员工职称", trigger: "blur"}],
          posId: [{required: true, message: "请输入员职位", trigger: "blur"}],
          engageForm: [{required: true, message: "请输入聘用形式", trigger: "blur"}],
          tiptopDegree: [{required: true, message: "请输入学历", trigger: "blur"}],
          school: [{required: true, message: "请输入毕业院校", trigger: "blur"}],
          beginDate: [{required: true, message: "请输入入职日期", trigger: "blur"}],
          workState: [{required: true, message: "请输入工作状态", trigger: "blur"}],
          contractTerm: [{required: true, message: "请输入合同期限", trigger: "blur"}],
          notWorkDate: [{required: true, message: "请输入离职日期", trigger: "blur"}],
          beginContract: [{required: true, message: "请输入合同起始日期", trigger: "blur"}],
          endContract: [{required: true, message: "请输入合同截止日期", trigger: "blur"}],
          workAge: [{required: true, message: "请输入工龄", trigger: "blur"}],
        }
      };
    },
    mounted() {
      this.initEmployees();
      this.initData();
      this.initPositions();
    },
    methods: {
      //导入数据成功之前
      beforeUpload() {
        this.importDataBtnIcon = "el-icon-loading";
        this.importDataBtnText = "正在上传";
        this.importDataDisabled = true;
      },
      //成功上传员工信息
      successUpload() {
        this.importDataBtnIcon = "el-icon-upload2";
        this.importDataBtnText = "导入数据";
        this.initEmployees();
        this.importDataDisabled = false;
      },
      //上传员工信息失败
      errorUpload() {
        this.importDataBtnIcon = "el-icon-upload2";
        this.importDataBtnText = "导入数据";
        this.importDataDisabled = false;
      },
      //初始所有员工信息|搜索|高级搜索
      initEmployees(type) {
        this.loading = true;
        //定义不同的url，实现不同的功能
        let url = `/employee/basic/?currentPage=${this.currentPage}&pageSize=${this.pageSize}`;
        if (type && type === "advanceSearch") {
          if (this.advanceSearchValue.politicId) {
            url += "&politicId=" + this.advanceSearchValue.politicId;
          }
          if (this.advanceSearchValue.nationId) {
            url += "&nationId=" + this.advanceSearchValue.nationId;
          }
          if (this.advanceSearchValue.posId) {
            url += "&posId=" + this.advanceSearchValue.posId;
          }
          if (this.advanceSearchValue.jobLevelId) {
            url += "&jobLevelId=" + this.advanceSearchValue.jobLevelId;
          }
          if (this.advanceSearchValue.engageForm) {
            url += "&engageForm=" + this.advanceSearchValue.engageForm;
          }
          if (this.advanceSearchValue.departmentId) {
            url += "&departmentId=" + this.advanceSearchValue.departmentId;
          }
          if (this.advanceSearchValue.beginDateScope) {
            url += "&dateScope=" + this.advanceSearchValue.beginDateScope;
          }
        } else {
          url += `&name=${this.employeeName}`;
        }
        this.getRequest(url).then(response => {
          this.loading = false;
          if (response.code === 200) {
            this.employees = response.data.data;
            this.total = response.data.total;
          } else {
            this.$message.error(response.message);
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
      //点击添加员工按钮展示对话框
      showAddEmployee() {
        this.title = "添加员工";
        this.employee = {
          id: null,
          name: "",
          gender: "",
          birthday: "",
          idCard: "",
          wedlock: "",
          nationId: null,
          nativePlace: "",
          politicId: null,
          email: "",
          phone: "",
          address: "",
          departmentId: null,
          jobLevelId: null,
          posId: null,
          engageForm: "",
          tiptopDegree: "",
          specialty: "",
          school: "",
          beginDate: "",
          workState: "在职",
          workID: "",
          contractTerm: null,
          conversionTime: "",
          notWorkDate: null,
          beginContract: "",
          endContract: "",
          workAge: null,
          salaryId: null,
        };
        this.inputDepName = "";
        this.dialogVisible = true;
        this.getMaxWorkID();
      },
      //初始一些数据，包括民族、职称、政治面貌
      initData() {
        if (!window.sessionStorage.getItem("nations")) {
          this.getRequest("/employee/basic/nations").then(resp => {
            if (resp.code === 200) {
              this.nations = resp.data;
              window.sessionStorage.setItem("nations", JSON.stringify(resp.data));
            } else {
              this.$message.error(resp.message);
            }
          });
        } else {
          this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
        }
        if (!window.sessionStorage.getItem("joblevels")) {
          this.getRequest("/employee/basic/jobLevels").then(resp => {
            if (resp.code === 200) {
              this.joblevels = resp.data;
              window.sessionStorage.setItem("joblevels", JSON.stringify(resp.data));
            } else {
              this.$message.error(resp.message);
            }
          });
        } else {
          this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
        }
        if (!window.sessionStorage.getItem("politicStatus")) {
          this.getRequest("/employee/basic/politicsStatus").then(resp => {
            if (resp.code === 200) {
              this.nations = resp.data;
              window.sessionStorage.setItem("politicStatus", JSON.stringify(resp.data));
            } else {
              this.$message.error(resp.message);
            }
          });
        } else {
          this.politicStatus = JSON.parse(window.sessionStorage.getItem("politicStatus"));
        }
      },
      //初始职位信息
      initPositions() {
        this.getRequest("/employee/basic/positions").then(resp => {
          if (resp.code === 200) {
            this.positions = resp.data;
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      //获取最大工号
      getMaxWorkID() {
        this.getRequest("/employee/basic/maxWorkId").then(resp => {
          if (resp.code === 200) {
            this.employee.workID = resp.data;
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      //获取所有部门
      getAllDepartments() {
        this.getRequest("/employee/basic/deps").then(resp => {
          if (resp.code === 200) {
            this.allDepartments = resp.data;
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      //展示部门选项
      showDepView() {
        this.getAllDepartments();
        this.visible = !this.visible;
      },
      //添加员工中的选择员工的部门
      handleNodeClick(data) {
        this.inputDepName = data.name;
        this.employee.departmentId = data.id;
        this.visible = !this.visible;
      },
      //展示部门选项
      showDepView2() {
        this.getAllDepartments();
        this.visible2 = !this.visible2;
      },
      //高级搜索中的部门
      advanceSearchHandleNodeClick(data) {
        this.inputDepName = data.name;
        this.advanceSearchValue.departmentId = data.id;
        this.visible2 = !this.visible2;
      },
      //高级搜索隐藏后，数据要更新，再次打开的时候，关键字需清空
      advanceSearchShow() {
        this.showAdvanceSearchVisible = !this.showAdvanceSearchVisible;
        if (!this.showAdvanceSearchVisible) {
          this.advanceSearchValue = {};
          this.initEmployees();
        }
      },
      //添加|编辑员工信息
      doAddEmployee() {
        //如果有员工的id，则是编辑员工信息
        if (this.employee.id) {
          this.$refs["empForm"].validate(valid => {
            if (valid) {
              this.putRequest("/employee/basic/", this.employee).then(resp => {
                if (resp.code === 200) {
                  this.dialogVisible = false;
                  this.initEmployees();
                  this.$message.success("更新成功");
                } else {
                  this.$message.error(resp.message);
                }
              });
            }
          });
        }
        //如果没有员工id，则是添加员工
        else {
          this.$refs["empForm"].validate(valid => {
            if (valid) {
              this.postRequest("/employee/basic/", this.employee).then(resp => {
                if (resp.code === 200) {
                  this.dialogVisible = false;
                  this.initEmployees();
                  this.$message.success("添加成功");
                } else {
                  this.$message.error(resp.message);
                }
              });
            }
          });
        }
      },
      //删除员工
      deleteEmployee(employee) {
        this.$confirm("此操作将永久删除[" + employee.name + "]员工, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {
          //请求删除操作员接口
          this.deleteRequest(`/employee/basic/${employee.id}`).then((response) => {
            //如果请求删除成功
            if (response.code === 200) {
              this.initEmployees();
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
      //展示编辑员工对话框
      showEditEmpView(employee) {
        this.title = "编辑员工信息";
        this.employee = employee;
        this.inputDepName = employee.department.name;
        this.initPositions();
        this.dialogVisible = true;
      },
      //导出数据
      exportData() {
        this.downloadRequest("/employee/basic/export");
      },
    }
  };
</script>

<style scoped>
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }

    .slide-fade-leave-active {
        transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(5px);
        opacity: 0;
    }
</style>