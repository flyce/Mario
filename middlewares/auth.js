const jwt = require('jsonwebtoken');

class Auth {
    constructor(level) {
        this.level = level;
        Auth.USER = 8;
        Auth.ADMIN = 16;
        Auth.SUPER_ADMIN = 32;
    }

    get m() {
        return async (ctx, next) => {
            const userToken = ctx.headers.authorization;
            let errMsg = "Token 不合法";
            let userInfo;
            if(!userToken) {
                throw new global.errs.Forbbiden(errMsg);
            }
            try {
                userInfo = jwt.verify(userToken, global.config.security.secretKey);
            } catch (error) {
                // token 不合法 已过期
                if(error.name == "TokenExpiredError") {
                    errMsg = "TOKEN 已过期";
                }
                throw new global.errs.Forbbiden(errMsg);
            }

            // 用scope的数值进行分级控制 数值越大 权限越高
            if(userInfo.scope < this.level) {
                throw new global.errs.Forbbiden('权限不足');
            }

            ctx.auth = {
                uid: userInfo.uid,
                scope: userInfo.scope 
            }
            await next();
        }
    }

    static verifyToken(token) {
        console.log(global.config.security.accessToken.secretKey);
        try {
            jwt.verify(token, global.config.security.accessToken.secretKey);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = { Auth }