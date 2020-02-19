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
    /***
     * 初始化加载路由
     * 路由必须以两种方式导出：
     * 1. module.exports = router 此形式导出的router必须是Router实例化的
     * 2. module.exports = { configRouter } 配置路由方式必须以此格式导出
     */
    static initLoadRouters() {
        const apiDirectory = `${process.cwd()}/app/api`;
        const { loadConfigRouter } = require('./configration-router');


        requireDirectory(module, apiDirectory, {visit: whenLoadModule});

        function whenLoadModule(obj) {
            // 正常路由
            if(obj instanceof Router) {
                InitManager.app.use(obj.routes());
            }

            if(!!obj.configRouter) {
                const router = loadConfigRouter(obj.configRouter);
                InitManager.app.use(router.routes());
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