const deliveryServiceConfig = require("../config").deliveryService,
  Order = require('../models/Order').Model,
  Status = require('../enums').Status,
  request = require("request-promise-native");

const makeRequest = (path, method, countryCode, body = true, qs = null, headers = {}) => {
  console.log(`making request to ${deliveryServiceConfig.baseUrl}${path}`)

  const options = {
    url: `${deliveryServiceConfig.baseUrl}${path}`,
    method,
    qs: qs,
    json: body || true,
  };
  return request(options);
};

module.exports.getDeliveryInfo = async (deliveryId) => {
  return makeRequest(`/v1/delivery-info/${deliveryId}`, "GET");
};

module.exports.updateDeliveryStatus = async () => {
  const pendingOrders = await Order.find({status: Status.IN_TRANSIT});
  const batchMaxCount = deliveryServiceConfig.batchStatusUpdateMaxCount;

  if (pendingOrders.length > 0) {
    let batches = [];
    let tempBatch = [];
    let currentCount = 0;

    for (let i = 0; i < pendingOrders.length; i++) {
      tempBatch.push(pendingOrders[i].waybillNumber);
      currentCount++;

      if(currentCount === parseInt(batchMaxCount) || i === pendingOrders.length - 1){
        batches.push(tempBatch);
        currentCount = 0;
        tempBatch = [];
      }

    }

    for(let i = 0 ; i < batches.length ; i++){
      let batchUpdatedStatus = await getStatusForBatch(batches[i]);
      await processBatchUpdate(batchUpdatedStatus);
    }

    return batches;
  }
};

const getStatusForBatch = async (batch) => {
  console.log(`sending batch to delivery service for status`);
  return makeRequest(`/v1/delivery-status`, "POST", null, batch);
};

const processBatchUpdate = async (batchUpdatedStatus) => {
  const terminalStatus = [Status.SUCCESS, Status.FAILED];
  for(let i = 0 ; i < batchUpdatedStatus.length ; i++){
    let status = batchUpdatedStatus[i].shipmentStatus;
    if(terminalStatus.includes(status)){
      let updatedOrder = await Order.findOneAndUpdate({waybillNumber: batchUpdatedStatus[i].waybillNumber}, {
        status: status
      });
    }
  }
};
