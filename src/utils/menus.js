//初始菜单，发送请求
import {getRequest} from "@/utils/api";

//初始化菜单
export const initMenu = (router, store) => {
  //如果路由有信息，则不需要请求
  if (store.state.routes.length > 0) {
    return;
  } else {
    //获取请求
    getRequest("/system/cfg/menus").then(result => {
      //如果数据存在
      if (result.code === 200) {
        //格式化后的路由
        let fmtRoutes = formatRoutes(result.data);
        //添加到路由中
        router.addRoutes(fmtRoutes);
        //数据存到vuex
        store.commit("initRoutes", fmtRoutes);
      }
    });
  }
};

//定义一个格式化路由的函数
export const formatRoutes = (routes) => {
  let fmtRoutes = [];
  //遍历请求到的数据
  routes.forEach((router) => {
    let {
      path,
      component,
      name,
      iconCls,
      children
    } = router;
    //如果有子路由
    if (children && children instanceof Array) {
      // 递归
      children = formatRoutes(children);
    }
    //对单独路由进行格式化
    let fmtRouter = {
      path: path,
      name: name,
      iconCls: iconCls,
      children: children,
      component(resolve) {
        /*//ES5的写法，有懒加载的感觉
        require(["../views/" + component + ".vue"], resolve);*/
        //因为有包的名字，需要先判断属于哪个包
        if (component.startsWith("Home")) {
          require(["../views/" + component + ".vue"], resolve);
        } else if (component.startsWith("Emp")) {
          require(["../views/Emp/" + component + ".vue"], resolve);
        } else if (component.startsWith("Per")) {
          require(["../views/Per/" + component + ".vue"], resolve);
        } else if (component.startsWith("Sal")) {
          require(["../views/Sal/" + component + ".vue"], resolve);
        } else if (component.startsWith("Sta")) {
          require(["../views/Sta/" + component + ".vue"], resolve);
        } else if (component.startsWith("Sys")) {
          require(["../views/Sys/" + component + ".vue"], resolve);
        }
      },
    };
    fmtRoutes.push(fmtRouter);
  });
  return fmtRoutes;
};