const { Auth } = require('../../../middlewares/auth');

const configRouter = {
    "v1/config": [
        {
            path: '/',
            method: 'get',
            model: 'Demo',
            operate: 'find'
        },
        {
            path: '/',
            method: 'post',
            validator: 'DemoValidator',
            params: ['username', 'postData', 'email'],
            model: 'Demo',
            middleware: new Auth().m,
            operate: 'create'
        },
        {
            path: '/update',
            method: 'post',
            validator: 'DemoValidator',
            params: ['id', 'email'],
            model: 'Demo',
            middleware: new Auth().m,
            operate: 'update'
        },
        {
            path: '/delete',
            method: 'post',
            model: 'Demo',
            middleware: new Auth().m,
            operate: 'delete'
        }
    ],
};

module.exports = {
    configRouter
};
