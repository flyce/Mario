const Koa = require('koa');
const parser = require('koa-bodyparser');
const static = require('koa-static');
const path = require('path');

const InitManager = require('./core/init');
const catchError = require('./middlewares/exception');
const upload = require('./core/upload');
const { accessLogger } = require('./core/log');
const config = require('./config/env');

const app = new Koa();

app.use(catchError);
app.use(parser());
app.use(accessLogger());
app.use(upload.single('file'));
app.use(static(path.join(__dirname, config.static)));

InitManager.initCore(app);

app.listen(config.port, () => {
    console.log(`\n心上无垢，林间有风。\n\nopen http://127.0.0.1:${config.port}/\n`);
});