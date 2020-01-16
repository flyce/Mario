const Router = require('koa-router');
const upload = require('../../../core/upload');

const router = new Router();

router.post('/v1/file', upload.single('file'), ctx => {
    if(!ctx.req.file) {
       throw new global.errs.UploadError();
    }
    ctx.body = {
        success: true,
        data:  global.config.host + ctx.req.file.path.substring(10)
    }
});

module.exports = router;