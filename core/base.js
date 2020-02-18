const { Auth } = require('../middlewares/auth');
const { PositiveIntegerValidator } = require('../app/validators/validator');

const parsingParams = async (ctx, validator = PositiveIntegerValidator, params = ['id']) => {
    const v = await new validator().validate(ctx);
    const info = {};
    for (let param of params) {
        // 驼峰命名方式转下划线方式，以写入数据库
        const name = param.replace(/([A-Z])/g, "_$1").toLowerCase();
        info[name] = v.get(`body.${param}`);
    }
    return info;
};

const success = () => {
    throw new global.errs.Success();
};

class Base {
    router;
    model;
    validator;

    constructor(router, model, validator) {
        this.router = router;
        this.model = model;
        this.validator = validator;
    }

    all(createParams, updatePrams) {
        this.create(createParams);
        this.update(updatePrams);
        this.delete();
        this.get();
    }

    get() {
        this.router.get('/', async ctx => {
            ctx.body = await this.model.findAll();
        });
    }

    create(params) {
        this.router.post('/', new Auth().m, async ctx => {
            const postData = await parsingParams(ctx, this.validator, params);
            await this.model.create(postData);
            success();
        });
    }

    update(params) {
        this.router.post('/update', new Auth().m, async ctx => {
            const postData = await parsingParams(ctx, this.validator, params);
            const { id } = await parsingParams(ctx);
            const result = await this._modelGetOne(id);
            delete 'id';
            await result.update(postData);
            success();
        });
    }

    delete() {
        this.router.post('/delete', new Auth().m, async ctx => {
            const { id } = await parsingParams(ctx);
            const result = await this._modelGetOne(id);
            await result.destroy();
            success();
        });
    }

    async _modelGetOne(id) {
        const result = await this.model.findOne({
            where: {
                id
            }
        });
        if(!result) {
            throw new global.errs.NotFound();
        }
        return result;
    }

}

module.exports = {
    Base
};