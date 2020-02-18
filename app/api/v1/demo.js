const Router = require('koa-router');

const { DemoValidator } = require('../../validators/validator');
const { Demo } = require('../../models/demo');
const { Base } = require('../../../core/base');

const router = new Router({
    prefix: '/v1/demo'
});

const base = new Base(router, Demo, DemoValidator);
const createParams = ['username', 'email', 'postData'];
const updateParams = ['email', 'postData'];
base.all(createParams, updateParams);

module.exports = router;