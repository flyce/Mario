class HttpException extends Error {
    constructor(msg = '服务器错误', errorCode = 10000, code = 400) {
        super();
        this.errorCode = errorCode;
        this.msg = msg;
        this.code = code;
    }
}

class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 400;
        this.msg = msg || '参数错误';
        this.errorCode = errorCode || 10000;
    }
}

class Success extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 201; // 201操作成功 200 查询成功
        this.msg = msg || '成功';
        this.errorCode = errorCode || 0;
    }
}

class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 404;
        this.msg = msg || '资源未找到';
        this.errorCode = errorCode || 10000;
    }
}

class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 401;
        this.msg = msg || '授权失败';
        this.errorCode = errorCode || 10004;
    }
}

class Forbbiden extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 403;
        this.msg = msg || '禁止访问';
        this.errorCode = errorCode || 10006;
    }
}


class LoginMethodError extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 403;
        this.msg = msg || '禁止访问';
        this.errorCode = errorCode || 10004;
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden,
    LoginMethodError
}