const requireDirectory = require('require-directory');
const Router = require('koa-router');

class InitManager {
    static initCore(app) {
        // 入口方法
        InitManager.app = app;
        InitManager.initLoadRouters(app);
        InitManager.loadHttpExecption(); // 全局导入异常处理类
        InitManager.loadConfig();
    }

    // 导入的路由必须以moudle.exports = router的形式导出
    static initLoadRouters() {
        const apiDirectory = `${process.cwd()}/app/api`;

        requireDirectory(module, apiDirectory, {visit: whenLoadModule});

        function whenLoadModule(obj) {
            if(obj instanceof Router) {
                InitManager.app.use(obj.routes());
            }
        }
    }

    static loadConfig() {
        const config = require('../config/env');
        global.config = config;
    }

    // 全局导入异常处理类 not recommend
    static loadHttpExecption() {
        const errors = require('./http-exception');
        global.errs = errors;
    }
}

module.exports = InitManager;