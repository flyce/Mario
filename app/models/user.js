const bcrypt = require('bcryptjs');
const { Sequelize, Model } = require('sequelize');

const { sequelize } = require('../../core/db');

class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await User.findOne({
            where: {
                email
            }
        });

        if(!user) {
            throw new global.errs.NotFound('账号不存在');
        }

        const correct = bcrypt.compareSync(plainPassword, user.password);
        if(!correct) {
            throw new global.errs.AuthFailed('用户名或密码不正确');
        }
        return user;
    }

    static async getUserByOpenId(openid) {
        const user = await User.findOne({
            where: {
                openid
            }
        });
        return user;
    }

    static async registeryByOpenId(openid) {
        return await User.create({
            openid
        });
    }
}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING(128),
        unique: true
    },
    password: {
        // 设计模式 观察者模式
        type: Sequelize.STRING,
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true
    },
    headImageUrl: {
        type: Sequelize.STRING
    }
}, {
    sequelize,
    tableName: 'users'
})

module.exports = { User }