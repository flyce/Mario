const Router = require('koa-router');

const router = new Router();

router.get('/', ctx => {
    ctx.type = 'html';
    ctx.body = `<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} a{color:#2E5CD5;cursor:
      pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family:
      "Century Gothic","Microsoft yahei"; color: #333;font-size:18px;} h1{ font-size: 100px; font-weight: normal;
      margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"><p>
      Lin <br/><span style="font-size:30px">心上无垢，林间有风。</span></p></div> `;
});

router.get('/v1/', ctx => {
    ctx.body = {
        success: true,
        info: "server is running..."
    };
});

router.get('/v1/error', ctx => {
    throw new Error();
});

module.exports = router;