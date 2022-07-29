### replace与push的区别
1. replace(）进行页面跳转不会形成history，不可返回到上一层  
2. push()进行页面跳转回形成history，可返回到上一层
*****************
### 跨域问题
#### 常见跨域情形
   ①同域名，不同端口；  
   ②同域名，不同文件或者路径；  
   ③同域名，不同协议；  
   ④域名和域名对应相同的IP；  
   ⑤主域名相同，子域名不同；  
   ⑥不同域名
#### 解决方法
1、前端项目配置代理的方法解决跨域问题  
通过前端项目配置代理的方法解决跨域问题，具体步骤参考文章开头的案例来解决。

2、服务端配置跨域访问的方法解决跨域问题  
这个需要在服务端进行配置，具体操作设计后台操作，这里不再具体讲解。

3、通过Chrome的扩展插件的方法解决跨域问题  
涉及到墙的问题，所以在保证有梯子的情况下搜索使用Allow CORS: Access-Control-Allow-Origin即可。
#### 代理类型
  ①基本代理；  
  ```
    module.exports = {
        dev: {
            proxy: {
                '/api': 'http://localhost:8080’
            }
        }
    };
  ```
  ②重写路径代理；  
  ```
    module.exports = {
        dev: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080’,
                    pathRewrite: {'^/api' : ''}
                }
            }
        }
    };
  ```
  ③支持HTTPS的代理；  
  ```
    module.exports = {
        dev: {
            proxy: {
                '/api': {
                    target: 'https://dev-cloud.cc.com',
                    secure: false
                }
            }
        }
    };
  ```
  ④把请求代理到同一目标的代理
  ```
    module.exports = {
        dev: {
            proxy: [{
                context: ['/auth', '/api'],
                target: 'http://localhost:8080’,
            }]
        }
    };
  ```
************
### HTTP状态码
|  分类   | 类别  | 描述  |
|  :----  | :----  | :---- |
| 1xx  |  信息 | 服务器收到请求，需要请求者继续执行操作|
| 2xx  | 成功 | 操作被成功接收并处理|
| 3xx  | 重定向| 需要进一步的操作以完成请求|
| 4xx  | 客户端错误| 客户端请求出错，请求包含语法错误或服务器无法处理请求|
| 5xx  | 服务器错误|服务器处理请求出错|
#### 信息响应（100-199）
服务器收到请求，需要请求者继续执行操作  

#### 成功响应（200-299）
操作被成功接收并处理  
1. 100，继续。客户端应继续请求
2. 101，切换协议。服务器根据客户端的请求切换协议，只能切换到*更高级*的协议
#### 重定向（300-399）
需要进一步的操作以完成请求  
1. 200，请求成功。一般用于POST与GET请求
2. 204，No Content，无内容：表示客户端发送给客户端的请求得到了成功处理，但在返回的响应报文中不含实体的主体部分（没有资源可以返回）
3. 206，Partial Content，部分内容：表示客户端进行了范围请求，并且服务器成功执行了这部分的GET请求，响应报文中包含由Content-Range指定范围的实体内容。

#### 客户端错误（400-499）
客户端请求出错，请求包含语法错误或服务器无法处理请求  
1. 400,Bad Request：表示请求报文中存在语法错误；
2. 401，Unauthorized：未经许可，需要通过HTTP认证；
3. 403，Forbidden：服务器拒绝该次访问（访问权限出现问题）
4. 404，Not Found：表示服务器上无法找到请求的资源，除此之外，也可以在服务器拒绝请求但不想给拒绝原因时使用；

#### 服务器错误（500-599）
服务器处理请求出错  
1. 500，Inter Server Error：表示服务器在执行请求时发生了错误，也有可能是web应用存在的bug或某些临时的错误时；
2. 503，Server Unavailable：表示服务器暂时处于超负载或正在进行停机维护，无法处理请求

***********
### git的使用
#### 克隆项目
``` 
1. 在本地文件夹下打开，右击->git bash  
2. 复制gitee上的地址  
    git@gitee.com:username/yeb.git  
3. 输入 git clone git@gitee.com:username/yeb.git  
4. 本地出现git到的项目  
```
#### 提交项目
##### 提交某个文件
``` 
$ git add runoob-test.txt 
$ git commit -m "添加到远程"
master 69e702d] 添加到远程
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 runoob-test.txt

$ git push origin master    # 推送到 Github
```
##### 提交当前项目文件夹下的所有文件
```
1. 切换到到该目录下;
2. 暂存到本地仓库 git add ./*;
3. 提交到本地仓库 git commit -m 'xxx';
4. 提交到远程仓库 git push 
```
**********************