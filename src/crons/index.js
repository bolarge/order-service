const cron = require('node-cron');
const deliveryService = require('../services/DeliveryService');
const orderService = require('../services/OrderService');
const deliveryConfig = require('../config').deliveryService;

module.exports.startJobs = async () => {
  const cronJobs = [
    {
      cronFunc: deliveryService.updateDeliveryStatus,
      schedule: deliveryConfig.deliveryStatusUpdateSchedule,
      logMessage: 'running update delivery status task'
    },
    {
      cronFunc: orderService.batchCustomerInformationForRescheduledDeliveries,
      schedule: deliveryConfig.rescheduleDeliverySchedule,
      logMessage: 'sending batch of re-scheduled delivery only orders'
    },
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
