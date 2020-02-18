const routerConfig = {
    echo: [
        {
            path: '/a',
            method: 'get',
            validator: 'TestValidator',
            params: ['username', 'password', 'email'],
            model: 'Demo',
            middleware: '',
            operate: 'find'
        },
        {
            path: '/b',
            method: 'post',
            validator: 'TestValidator',
            params: ['username', 'password', 'email'],
            model: 'Demo',
            middleware: '',
            operate: 'create'
        }
    ]
};

module.exports = {
    routerConfig
};
