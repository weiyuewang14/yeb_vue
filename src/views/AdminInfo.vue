<template>
    <div>
        <el-card class="admin-card" style="width: 500px;">
            <div slot="header" class="clearfix">
                <span class="el-icon-user-solid">{{admin.name}}</span>
            </div>
            <div>
                <div style="display: flex;justify-content: center;margin-bottom: 8px;">
                    <!--接口未写，上传头像暂时无法实现-->
                    <el-upload
                            action="/admin/userface"
                            :headers="headers"
                            :data="admin"
                            :show-file-list="false"
                            :on-success="onSuccess">
                        <img title="点击修改头像"
                             :src="admin.userface"
                             style="height: 72px;width: 72px;border-radius: 36px">
                    </el-upload>
                </div>
                <el-descriptions class="margin-top" :column="1" border>
                    <el-descriptions-item>
                        <template slot="label">
                            <i class="el-icon-user"></i>
                            用户名
                        </template>
                        {{admin.username}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            <i class="el-icon-phone"></i>
                            固定电话
                        </template>
                        {{admin.telephone}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            <i class="el-icon-mobile-phone"></i>
                            手机号
                        </template>
                        {{admin.phone}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            <i class="el-icon-office-building"></i>
                            联系地址
                        </template>
                        {{admin.address}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                            <i class="el-icon-tickets"></i>
                            用户标签
                        </template>
                        <el-tag v-for="(role,index) in admin.roles" :key="role.id">{{role.nameZh}}</el-tag>
                    </el-descriptions-item>
                </el-descriptions>
                <div style="margin-top: 10px; display: flex;justify-content: space-around;">
                    <el-button type="primary" @click="dialogVisible=true">修改信息</el-button>
                    <el-button type="danger" @click="dialogVisible2 = true">修改密码</el-button>
                </div>
            </div>
        </el-card>
        <el-dialog
                title="编辑个人信息"
                :visible.sync="dialogVisible"
                width="40%">
            <el-descriptions class="margin-top" :column="1" border>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user-solid"></i>
                        姓名
                    </template>
                    <el-input v-model="admin2.name"></el-input>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-user"></i>
                        用户名
                    </template>
                    <el-input v-model="admin2.username"></el-input>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-phone"></i>
                        固定电话
                    </template>
                    <el-input v-model="admin2.telephone"></el-input>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-mobile-phone"></i>
                        手机号
                    </template>
                    <el-input v-model="admin2.phone"></el-input>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">
                        <i class="el-icon-office-building"></i>
                        联系地址
                    </template>
                    <el-input v-model="admin2.address"></el-input>
                </el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="修改密码"
                :visible.sync="dialogVisible2"
                width="40%">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="输入旧密码" prop="oldPass">
                    <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="输入新密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "AdminInfo",
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入密码"));
        } else {
          if (this.ruleForm.checkPass !== "") {
            this.$refs.ruleForm.validateField("checkPass");
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      };
      return {
        admin: {},
        admin2: {},
        dialogVisible: false,
        dialogVisible2: false,
        ruleForm: {
          oldPass: "",
          pass: "",
          checkPass: "",
        },
        rules: {
          oldPass: [
            {validator: validatePass, trigger: "blur"}
          ],
          pass: [
            {validator: validatePass, trigger: "blur"}
          ],
          checkPass: [
            {validator: validatePass2, trigger: "blur"}
          ],
        },
        headers: {
          Authorization: window.sessionStorage.getItem("tokenStr")
        }
      };
    },
    mounted() {
      this.initAdmin();
    },
    methods: {
      initAdmin() {
        this.getRequest("/admin/info").then(resp => {
          if (resp.code === 200) {
            this.admin = resp.data;
            this.admin2 = Object.assign({}, this.admin);
            window.sessionStorage.setItem("user", JSON.stringify(resp.data));
            this.$store.commit("INIT_ADMIN", resp.data);
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      /*showEditInfoDialog() {
        this.dialogVisible = true;
      },*/
      updateAdminInfo() {
        this.putRequest("/admin/info", this.admin2).then(resp => {
          if (resp.code === 200) {
            this.dialogVisible = false;
            this.initAdmin();
          } else {
            this.$message.error(resp.message);
          }
        });
      },
      /*showUpdatePassDialog() {
        this.dialogVisible2 = true;
      },*/
      onSuccess() {
        this.initAdmin();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.adminId = this.admin.id + "";
            this.putRequest("/admin/pass", this.ruleForm).then(resp => {
              if (resp.code === 200) {
                this.$message.success("更新成功，请重新登录");
                this.postRequest("/logout");
                window.sessionStorage.removeItem("user");
                window.sessionStorage.removeItem("tokenStr");
                this.$store.commit("initRoutes", []);
                this.$router.replace("/");
              } else {
                this.$message.error(resp.message);
              }
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }

  };
</script>

<style scoped>

</style>
