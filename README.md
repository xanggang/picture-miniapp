### 项目结构

```
--| cloudfunctions // 云函数
    |-- functionName // 云函数目录
        |-- index.js // 云函数暴露入口， 路由分发
        |-- functionName.js // 定义数据类型和数据库操作， 增删改查之类的
        |-- functionNamController // 具体业务处理， 根据情况调用该目录下的service或者其他云函数
    |-- article 文章相关
    |-- attention 关注相关
    |-- collection 收藏相关
    |-- userInfo 用户相关
--| miniprogram // 小程序
    |-- components // 小程序组件 
        |-- ArticleIte // 文章展示
        |-- ShowImages // 宫格图片展示，包含图片放大预览
    |-- pages
        |-- article-detail // 文章详情
        |-- index // 首页
        |-- login // 用户注册
        |-- message // 消息关注
        |-- my // 个人主页
        |-- my-collection // 个人收藏
        |-- release // 发布
    |-- utils
        |-- callFunction // 封装wx.callfunction
        |-- promisify // 封装wxapi， 便于使用await语法
        |-- update // 图片上传相关
```

### 开发目录
[x] 登录、注册、关注
[x] 发布、展示、查询、首页分页
[x] 收藏
[x] 详情页分享
[]个人名片,名片分享
[x]文章点赞
[]文章评论
[]私信
[]小程序消息推送
[]私信
[] ...
> 很可能后面的要太监掉了...