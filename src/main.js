import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
//引入font-awesome样式
import "font-awesome/css/font-awesome.css";


//引入请求
import {postRequest} from "@/utils/api";
import {putRequest} from "@/utils/api";
import {getRequest} from "@/utils/api";
import {deleteRequest} from "@/utils/api";
import {initMenu} from "@/utils/menus";
import {downloadRequest} from "@/utils/download";

Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.downloadRequest = downloadRequest;

Vue.config.productionTip = false;
Vue.use(ElementUI, {size: "small"});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
  //如果用户登录，才能获取菜单
  if (window.sessionStorage.getItem("tokenStr")) {
    //初始化菜单
    initMenu(router, store);
    //如果没有用户信息
    if (!window.sessionStorage.getItem("user")) {
      //发送请求获取用户信息
      return getRequest("/admin/info").then(response => {
        if (response.code === 200) {
          //将用户信息存储的sessionStorage中
          window.sessionStorage.setItem("user", JSON.stringify(response.data));
          store.commit("INIT_ADMIN", response.data);
          next();
        }
      });
    }
    next();
  }
  //如果没有登录
  else {
    //如果去的是登录页，则直接跳转
    if (to.path === "/") {
      next();
    }
    // 如果不是，则需要先登录，然后直接跳转至要去的页面
    else {
      next("/?redirect=" + to.path);
    }
  }
  // next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

