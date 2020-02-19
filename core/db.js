const { Sequelize, Model } = require('sequelize');
const { unset, clone, isArray } = require('lodash');

const { dbName, user, password, host, port } = require('../config/env').database;

const sequelize = new Sequelize(dbName, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: '',
    timezone: '+08:00',
    define: {
        timestamps: true,
        // paranoid: true,
        freezeTableName: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            }
        }
    }
});

sequelize.sync({
    force: false
});

// json 序列化
Model.prototype.toJSON = function () {
    let data = clone(this.dataValues);
    unset(data, 'updatedAt');
    unset(data, 'createdAt');
    unset(data, 'deletedAt');

    if(isArray(this.exclude)) {
        this.exclude.forEach((value) => {
            unset(data, value);
        })
    }
    return data;
};

module.exports = {
    sequelize
};