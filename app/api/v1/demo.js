const Router = require('koa-router');

const { DemoValidator } = require('../../validators/validator');
const { Demo } = require('../../models/demo');
const { BaseRouter } = require('../../lib/base-router');

const router = new Router({
    prefix: '/v1/demo'
});

const cosRouter = new BaseRouter(router, Demo, DemoValidator);
const createParams = ['username', 'email', 'postData'];
const updateParams = ['email', 'postData'];
cosRouter.all(createParams, updateParams);

module.exports = router;