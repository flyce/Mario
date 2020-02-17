const requireDirectory = require('require-directory');
const CronJob = require('cron').CronJob;

const scheduleDirectory = `${process.cwd()}/app/schedules`;

requireDirectory(module, scheduleDirectory, { visit: whenLoadModule });

function whenLoadModule(obj) {
    if(obj instanceof Object && obj.fun instanceof Function) {
        const job = new CronJob(obj.rule, () => { obj.fun() });
        job.start();
    }
}
