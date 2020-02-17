const moment = require('moment');

const { demoRule } = require('./rule');

const demo = async function () {
    console.log(moment().format("YYYY-MM-DD HH:mm:ss"));
};

module.exports = {
    fun: demo,
    rule: '*/10 * * * * *'
};
