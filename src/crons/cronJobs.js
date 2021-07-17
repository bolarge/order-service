const cron = require('node-cron');
const deliveryService = require('../services/DeliveryService');
const config = require('../config');

module.exports.startJobs = async () => {
  const cronJobs = [
    {
      cronFunc: deliveryService.updateDeliveryStatus,
      schedule: config.deliveryService.deliveryUpdateSchedule,
      logMessage: 'running update delivery status task'
    }
  ];

  for (let job of cronJobs) {
    cronGenerator(job.schedule, job.cronFunc, job.logMessage);
  }
};

const cronGenerator = async (schedule, cronFunction, logMessage) => {
  cron.schedule(schedule, function () {
    console.log(logMessage);
    cronFunction();
  }, {});
};
