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
    }
    await User.create(user);
    success();
});

router.post('/login', async (ctx) => {
    const v = await new TokenValidator().validate(ctx);
    let token

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

router.post('/file', async ctx => {
    ctx.body = ctx.req.file;
})

router.post('/update', async ctx => {});


async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret);
    return generateToken(user.id, Auth.USER);
}

module.exports = router;