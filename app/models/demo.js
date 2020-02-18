const { Sequelize, Model } = require('sequelize');

const { sequelize } = require('../../core/db');

class Demo extends Model {
}

Demo.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.STRING,
    email: {
        type: Sequelize.STRING
    },
    post_data: Sequelize.STRING
}, {
    sequelize,
    tableName: 'demos'
});

module.exports = {
    Demo
};