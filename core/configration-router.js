const Router = require('koa-router');
const requireDirectory = require('require-directory');

const validator = requireDirectory(module, `${process.cwd()}/app/validators`);
const model = requireDirectory(module, `${process.cwd()}/app/models`);

const { Success } = require('./http-exception');

const router = new Router();

function loadDependence(dens)  {
    const combine = {};
    for (let key in dens) {
        const file = dens[key];
        for (let fun in file) {
            combine[fun] = file[fun];
        }
    }
    return combine;
}

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
        this.validator = validators[routerInfo.validator || 'PositiveIntegerValidator'];
        this.params = routerInfo.params || ['id'];
        this.model = models[routerInfo.model];
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
                case 'create': await this._create(postData);break;
                case 'update': await this._update(postData);break;
                case 'delete': await this._delete(postData);break;
                default: throw new Error(`路由 ${this.path} 操作错误，仅允许使用create update delete`);
            }
            throw new Success();
        });
    }

    get() {
        this.router.get(this.path, async ctx => {
            if(this.operate.toLowerCase() !== 'find') {
                throw new Error(`路由 ${this.path} 操作错误，仅允许使用find`);
            }
            ctx.body = await this._findAll();
        });
    }

    async _create(data) {
        await this.model.create(data);
    }

    async _delete(data) {
        const res = await this._findOne(data.id);
        await res.destroy();
    }

    async _update(data) {
        const res = await this._findOne(data.id);
        delete data.id;
        await res.update(data);
    }

    async _findAll() {
        return await this.model.findAll();
    }

    async _findOne(id) {
        const res = await this.model.findOne({
            where: {
                id
            }
        });
        if(!res) {
            throw new global.errs.NotFound('查不到该记录');
        }
        return res;
    }

    async _parsingParams (ctx, validator, params)  {
        const v = await new this.validator().validate(ctx);
        const info = {};
        for (let param of params) {
            // 驼峰命名方式转下划线方式，以写入数据库
            const name = param.replace(/([A-Z])/g, "_$1").toLowerCase();
            if(name === uid ) {
                info[name] = ctx.auth.uid;
            } else {
                info[name] = v.get(`body.${param}`);
            }
        }
        return info;
    };
}

// 加载配置路由
function loadConfigRouter(obj) {
    for (let item in obj) {
        for(let subItem of obj[item]) {
            const routerInfo = subItem;
            routerInfo.path = '/' + item + subItem.path;
            new ConfigRouter(routerInfo, router);
        }
    }
    return router;
}
const validators = loadDependence(validator);
const models = loadDependence(model);

module.exports = {
    loadConfigRouter
};

