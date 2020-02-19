const jwt = require('jsonwebtoken');

const findMembers = function (instance, {
        prefix,
        specifiedType,
        filter
    }) {
      // 递归函数
    function _find(instance) {
        //基线条件（跳出递归）
        if (instance.__proto__ === null)
            return [];

        let names = Reflect.ownKeys(instance);
        names = names.filter((name) => {
            // 过滤掉不满足条件的属性或方法名
            return _shouldKeep(name);
        });

        return [...names, ..._find(instance.__proto__)];
    }

    function _shouldKeep(value) {
        if (filter) {
            if (filter(value)) {
                return true;
            }
        }
        if (prefix)
            if (value.startsWith(prefix))
                return true;
        if (specifiedType)
            if (instance[value] instanceof specifiedType)
                return true;
    }

    return _find(instance);
};

const generateToken = function(uid, scope) {
    const accessSecretKey = global.config.security.accessToken.secretKey;
    const accessExpiresIn = global.config.security.accessToken.expiresIn;
    console.log(accessSecretKey, accessExpiresIn);
    const accessToken = jwt.sign({
        uid,
        scope
    }, accessSecretKey, {
        expiresIn: accessExpiresIn
    });
    const refreshSecretKey = global.config.security.refreshToken.secretKey;
    const refreshExpiresIn = global.config.security.refreshToken.expiresIn

    const refreshToken = jwt.sign({
        uid,
        scope
    }, refreshSecretKey, {
        expiresIn: refreshExpiresIn
    });
    return {
        refreshToken,
        accessToken
    };
};

module.exports = {
  findMembers,
  generateToken,
};