//向服务器发送请求，获取数据
import axios from "axios";
// 引入消息提醒插件
import {Message} from "element-ui";
import router from "@/router";

//请求拦截器
axios.interceptors.request.use(config => {
  //如果存在token，请求携带token
  if (window.sessionStorage.getItem("tokenStr")) {
    config.headers["Authorization"] = window.sessionStorage.getItem("tokenStr");
  }
  return config;
}, error => {
  console.log(error);
});


//响应拦截器
axios.interceptors.response.use(success => {
  //业务逻辑错误
  if (success.status != null && success.status === 200) { //访问接口是成功的
    if (success.data.code === 500 || success.data.code === 401 || success.data.code === 403) {
      Message.error({message: success.data.message});
      return;
    }
    /*先打开，为了展示是请求的哪个接口，等后面给关掉*/
    /*if (success.data.code === 200) {
      Message.success({message: "请求地址为："+ success.request.responseURL +"---"+ success.data.message});
    }*/
  }
  return success.data;
}, error => {//接口访问失败
  if (error.response.code === 504 || error.response.code === 404) {
    Message.error({message: "服务器无法连接"});
  } else if (error.response.code === 403) {
    Message.error({message: "权限不足，请联系管理员"});
  } else if (error.response.code === 401) {
    Message.error({message: "尚未登录，请登录"});
    //跳转到登录页
    router.replace("/");
  } else {
    if (error.response.data.message) {
      Message.error({message: error.response.data.message});
    } else {
      Message.error({message: "未知错误"});
    }
  }
  return;
});

let base = "";

//传送json格式的post请求,封装post请求
export const postRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params
  });
};
//传送json格式的put请求,封装put请求
export const putRequest = (url, params) => {
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params
  });
};
//传送json格式的get请求,封装get请求
export const getRequest = (url, params) => {
  return axios({
    method: "get",
    url: `${base}${url}`,
    data: params
  });
};

//传送json格式的delete请求,封装delete请求
export const deleteRequest = (url, params) => {
  return axios({
    method: "delete",
    url: `${base}${url}`,
    data: params
  });
};
