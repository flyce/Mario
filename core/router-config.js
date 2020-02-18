const Router = require('koa-router');

const { PositiveIntegerValidator } = require('../app/validators/validator');
const { routerConfig } = require('../config/router-config');

const router = new Router();

router.get('/echo2', ctx => {
    ctx.body = {
        path: '/echo2'
    };
});

class ConfigRouter {
    path;
    method;
    validator;
    params;
    model;
    middleware;
    operate;
    router;

    constructor(routerInfo, router) {
        this.path = routerInfo.path;
        this.method = routerInfo.method;
        this.validator = routerInfo.validator;
        this.params = routerInfo.params;
        this.model = routerInfo.model;
        this.middleware = routerInfo.middleware;
        this.operate = routerInfo.operate;
        this.router = router;
        const method = routerInfo.method.toLowerCase();

        switch (method) {
            case 'post': this.post();break;
            case 'get': this.get();break;
            default: throw new Error(`路由 ${this.path} 方法错误，仅允许使用POST GET`);
        }
    }

    post() {
        this.router.post(this.path, this.middleware, async ctx => {
            const postData = await this._parsingParams(ctx, this.validator, this.params);
            switch (this.operate) {
                case 'create': this._create(postData);break;
                case 'update': this._update(postData);break;
                case 'delete': this._delete();break;
                default: throw new Error(`路由 ${this.path} 操作错误，仅允许使用create update delete`);
            }
            ctx.body = {
                success: true
            }
        });
    }

    get() {
        this.router.get(this.path, ctx => {
            if(this.operate.toLowerCase() !== 'find') {
                throw new Error(`路由 ${this.path} 操作错误，仅允许使用find`);
            }
            this._findAll();
            ctx.body = {
                success: true
            }
        });
    }

    _create(createData) {
        console.log('_create');
    }

    _delete() {
        console.log('_delete');
    }

    _update(updateData) {
        console.log('_update');
    }

    _findAll() {
        console.log('_findAll');
    }

    _findOne() {

    }

    async _parsingParams (ctx, validator = PositiveIntegerValidator, params = ['id'])  {
        const v = await new validator().validate(ctx);
        const info = {};
        for (let param of params) {
            // 驼峰命名方式转下划线方式，以写入数据库
            const name = param.replace(/([A-Z])/g, "_$1").toLowerCase();
            info[name] = v.get(`body.${param}`);
            }
        return info;
    };
}

for (let item in routerConfig) {
    for(let subItem of routerConfig[item]) {
        const r = subItem;
        r.path = '/' + item + subItem.path;
        new ConfigRouter(r, router);

    }
}

module.exports = router;

