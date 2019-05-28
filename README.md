### 云开发相关

每个云函数只能用该文件下的js文件，所以没有办法封装一个通用的东西了，
目前项目结构

```
|-- functionName // 云函数目录
    |-- index.js // 云函数暴露入口， 路由分发
    |-- functionName.js // 定义数据类型和数据库操作， 增删改查之类的
    |-- functionNamController // 具体业务处理， 根据情况调用该目录下的service或者其他云函数
```

#### 其中， 在index.js中， 会将当前请求的用户的openID传入event， 并且链式传递下去， 在小程序请求时， 会添加action作为路由