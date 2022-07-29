let proxyObj = {};

proxyObj["/"] = {
  //websocket
  "ws": false,
  //目标地址
  // "target": "http://121.40.140.4:8081",
  "target": "http://localhost:8081/",
  //发送请求头中的host会被设置为target
  "changeOrigin": true,
  //不重写请求地址
  "pathRewrite":{
    '^/':'/'
  }
};


module.exports = {
  productionSourceMap: false,
  // 关闭ESLINT校验工具
  lintOnSave: false,
  //配置代理跨域
  devServer: {
      host: "localhost",
      port: 8080,
      proxy:proxyObj,
  },
  // css: {
  //   loaderOptions: {
  //     postcss: {
  //       plugins: [
  //         require('postcss-pxtorem')({
  //           rootValue: 37.5,
  //           propList: ['*']
  //         })
  //       ]
  //     }
  //   }
  // },
};
