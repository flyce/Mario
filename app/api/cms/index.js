const Router = require('koa-router');

const router = new Router();

router.get('/cms/', ctx => {
    ctx.body = {
        success: true,
        info: "server is running..."
    };    
});

module.exports = router;