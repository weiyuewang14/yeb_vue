//封装下载
import axios from "axios";

const service = axios.create({
  //定义一个默认响应类型
  responseType: "arraybuffer"
});

//请求拦截器
service.interceptors.request.use(config => {
  config.headers["Authorization"] = window.sessionStorage.getItem("tokenStr");
  return config;
}, error => {
  console.log(error);
});

//相应拦截器
service.interceptors.response.use(resp => {
  const headers = resp.headers;
  let reg = RegExp(/application\/json/);
  if (headers["content-type"].match(reg)) {
    resp.data = unitToString(resp.data);
  } else {
    let fileDownload = require("js-file-download");
    let fileName = headers["content-disposition"].split(";")[1].split("filename=")[1];
    let contentType = headers["content-type"];
    fileName = decodeURIComponent(fileName);
    fileDownload(resp.data, fileName, contentType);

  }
}, error => {
  console.log(error);
});

//JSON格式转换
function unitToString(unitArray) {
  let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray));
  let decodeString = decodeURIComponent(escape(encodedString));
  return JSON.parse(decodeString);
}

let base = "";
export const downloadRequest = (url, params) => {
  return service({
    method: "get",
    url: `${base}${url}`,
    data: params
  });
};

export default service;