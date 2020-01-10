const util = require('util');
const axios = require('axios');

const { User } = require('../models/user');
const { generateToken } = require('../../core/util');
const { Auth } = require('../../middlewares/auth');

class WXManager {
    static async codeToToken(code) {
        const {appId, appSecret, loginUrl } = global.config.wx;
        const url = util.format(loginUrl, appId, appSecret, code);
        const result = await axios.get(url);

        if(result.status !== 200) {
            throw new global.errs.AuthFailed('openid 获取失败');
        }
        const errcode = result.data.errcode;
        const errMsg = result.data.errMsg;
        if(errcode) {
            throw new global.errs.AuthFailed('openid 获取失败' + errMsg);
        }

        let user = await User.getUserByOpenId(result.data.openid);
        if(!user) {
            user = await User.registeryByOpenId(result.data.openid);
        }
        return generateToken(user.id, Auth.USER);
    }
}

module.exports = { WXManager };