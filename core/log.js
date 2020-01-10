const path = require('path');
const log4js = require('koa-log4');
 
log4js.configure({
 appenders: {
  access: {
   type: 'DateFile',
   pattern: 'yyyy-MM-dd.log', //生成文件的规则
   filename: path.join(__dirname, '../logs/'),
   alwaysIncludePattern: true,
  },
  out: {
   type: 'console'
  }
 },
 categories: {
  default: { appenders: [ 'out' ], level: 'info' },
  access: { appenders: [ 'access' ], level: 'info' },
 }
});
 
exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志