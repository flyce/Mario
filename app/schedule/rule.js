module.exports = {
    demoRule: '*/2 * * * * *'
};


/***
 * for use schedule function
 * you should create a js file as follows,
 * and export a object which have two attributes
 * one is fun, other is rule
 */
// const { demoRule } = require('./rule');
//
// const schedule = function () {
//     const d = new Date();
//     console.log('Every Tenth Minute:', d);
// };

// module.exports = {
//     fun: schedule,
//     rule: demoRule
// };
