# Cactus

> 基于`koa 2`开发的`WEB`框架，在服务端实现配置式路由功能

## 注意

**cactus还在开发中，强烈不建议用于实际项目**

## 开始

请确保你拥有 mysql 数据库和 node.js 的运行环境。

请在`config/env.js`中修改你自己的配置。

初始化依赖项
```shell script
npm i
```

接下来，请选择一个方式运行你的程序。

```shell script
npn run dev # 开发环境
npm run prod # 生产环境
```
更多配置请查看`package.json`。

## 项目结构
```shell script
cactus
├── app
│   ├── api
│   │   ├── cms // 关于cms的api
│   │   │   └── index.js
│   │   └── v1 // 普通api
│   │       ├── config.js // 配置路由示例
│   │       ├── demo.js
│   │       ├── index.js
│   │       └── user.js // 用户注册、登录路由
│   ├── lib 
│   │   ├── base-router.js // 路由直接操作数据库的辅助类
│   │   ├── enum.js // 枚举变量定义
│   │   └── helper.js // 助手函数
│   ├── models // 模型层
│   │   └── user.js // 用户模型
│   ├── schedules // 计划任务目录
│   │   ├── demo-schedule.js // 示例计划任务
│   │   └── rule.js // 计划任务的运行规则
│   ├── services // 服务层
│   │   └── wx.js // 微信小程序登录
│   └── validators // 数据校验目录
│       └── validator.js
├── app.js // 创建koa实例及应用扩展
├── config // 配置目录
│   └── env.js // 项目环境变量
├── core
│   ├── configration-router.js // 配置式路由转换
│   ├── db.js // 数据库初始化
│   ├── http-exception.js
│   ├── init.js // 实例化KOA
│   ├── log.js // 日志配置
│   ├── schedule.js // 计划任务
│   ├── upload.js // 文件上传
│   ├── util.js // 助手函数
│   └── validator.js // 校验器
└── middleware
    └── auth.js // 用户权限识别
```

## 配置式路由介绍
配置式路由的目的是降低我们重复写CURD的频率，在项目开发中，多多少少都会存在一些表，没有任何业务逻辑，只会执行增删查该操作。  配置式路由可帮我们把有限的精力投入到业务逻辑的实现。  
您只需配置路由及相关参数，其他的交给程序来处理。
举个栗子，数据库中有一个关系表用于记录用户收藏的商品，此表有三个字段: `id`, `spu_id`, `uid`，当用户收藏商品时，服务器会接收到一条数据
```json
{
    "spuId": 1,
    "uid": 1
}
```
利用配置式路由，我们可以很简单的将此条数据插入到数据库。  
在`app/api/v1`下创建一个文件`favor.js`
```javascript
const configRouter = {
    "v1/favor": [
        {
            path: '/',
            method: 'post',
            validator: 'FavorValidator',
            params: ['spuId', 'uid'],
            model: 'Favor',
            operate: 'create'
        }
    ],
};

module.exports = {
    configRouter
};
```
此时用户收藏商品的功能就完成了，我们来验证一下，在根目录的创建`request.rest`文件，内容如下:
```http request
### create demo data
POST http://127.0.0.1:3000/v1/config/
Content-Type: application/json

{
    "username": "paco",
    "email": "paco@flyce.cn",
    "postData": "1234"
}
```
点击发送请求，就可看到响应：
```
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8
Content-Length: 59
Date: Wed, 19 Feb 2020 17:02:49 GMT
Connection: close

{
  "msg": "成功",
  "errorCode": 0,
  "request": "POST /v1/config/"
}
```
搞定！！！就是这么容易。
配置式路由需要使用JSON的格式来配置，规范如下：
```
{
    parentPath: [
        {
            path: "/subpath",
            method: "post or get",
            validator: "validator for this router",
            params: ["data", "what", "you", "want", "to", "save"],
            model: "model what you create",
            operate: "find, create, update or delete"
        },
        {
            path: "/another-sub-path",
            method: "post or get",
            validator: "validator for this router",
            params: ["data", "what", "you", "want", "to", "save"],
            model: "model what you create",
            operate: "find, create, update or delete"
        }
    ]
}
```
下面对各个参数进行说明:  

| key  | description | value |
| --- | --- | --- |
| parentPath | 用户自定义的路由 | 
| path | 用户自定义的子路由，需要以`/`开头 | |
| method | 服务器接受的请求类型 | `POST` `GET` |
| validator|  针对此路由的数据验证器，需在app/validators下创建，此处以字符串的形式填写验证器的名字，框架会自动加载 | |
| params | 需要保存的字段，类型是`Array`，如不定义，用户提交的数据会全部丢弃；此处需要以驼峰命名的方式编写，框架在保存时会自动转化成下划线命名的方式；uid为保留字段，即使用户传了uid，此处也会从Auth中间件获取，框架默认`POST`请求从`body`查找参数，`GET`请求从`url path`查找参数，当前版本不可修改 | 
| model | 用户创建的模型，填写字符串，框架自动加载 | 
| operate | 处理模型的操作 | `find` `findOne` `create` `delete` `update`

## 正常路由的使用
在一个正常的项目中，显然配置式路由是无法满足业务需求的。  
比如用户登录，校验完成后，我们不能把用户的所有信息返回给用户，配置式路由就无法实现业务需求，别担心，直接使用`koa-router`即可。  
在`app/api/v1`下创建`user.js`，内容如下:
```javascript
const Router = require('koa-router');

const { RegisterValidator, TokenValidator, NotEmptyValidator } = require('../../validators/validator');
const { User } = require('../../models/user');
const { success } = require('../../lib/helper');
const { LoginType } = require('../../lib/enum');
const { Auth } = require('../../../middlewares/auth');
const { generateToken } = require('../../../core/util');
const { WXManager } = require('../../services/wx');

const router = new Router({
    prefix: '/v1/user'
});

router.post('/register', async (ctx) => {
    // 参数 email uasename pasword
    const v = await new RegisterValidator().validate(ctx);
  
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password'),
        username: v.get('body.username')
    };
    await User.create(user);
    success();
});

router.post('/login', async (ctx) => {
    const v = await new TokenValidator().validate(ctx);
    let token;

    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'), v.get('body.password'));
            break;
        case LoginType.USER_MINI_PROGRAM: 
            token = await WXManager.codeToToken(v.get('body.account'));
            break;
        default: 
            throw new global.errs.ParameterException('没有相应的处理函数')
    }

    ctx.body = {
        token
    }
});

router.post('/tokenVerify', async (ctx) => {
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        isValid: result
    }
});

async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret);
    return generateToken(user.id, Auth.USER);
}

module.exports = router;
```
需要注意的是，基于`koa-router`实现路由自动加载的条件时，导出的是实例化的`Router`。

## 持续编写中...
