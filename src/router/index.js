import Vue from "vue";
import VueRouter from "vue-router";
import Login from "@/views/Login";
import Home from "@/views/Home";
import AdminInfo from "@/views/AdminInfo";

Vue.use(VueRouter);

//先把VueRouter原型对象的push保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

//重写push|replace方法
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    originPush.call(this, location, resolve, reject);
  } else {
    originPush.call(this, location, () => {
    }, () => {
    });
  }

};
VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    originReplace.call(this, location, resolve, reject);
  } else {
    originReplace.call(this, location, () => {
    }, () => {
    });
  }

};

const routes = [
  {
    path: "/",
    name: "login",
    component: Login,
    hidden: true
  },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [
      {
        path: "/userinfo",
        name: "个人中心",
        component: AdminInfo
      }
    ]
  }
];

const router = new VueRouter({
  // mode: "history",
  //配置路由
  routes,
});


export default router;
