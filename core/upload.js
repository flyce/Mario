const multer =require('koa-multer');
const config = require('../config/env');

const storage = multer.diskStorage({
  destination: config.fileUpload.path + '/' + new Date().getFullYear() + (new Date().getMonth()+1) + new Date().getDate(),
  filename(ctx,file,cb){
    const filenameArr = file.originalname.split('.');
    cb(null,Date.now() + '.' + filenameArr[filenameArr.length-1]);
  }
});

const upload = multer({storage});

module.exports = upload;