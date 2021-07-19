const deliveryServiceConfig = require("../config").deliveryService,
  Order = require('../models/Order').Model,
  Status = require('../enums').Status,
  PushMessageKeys = require('../enums').PushMessageKeys,
  messagingService = require('../services/MessagingService'),
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

    for (let i = 0; i < pendingOrders.length; i++) {
      tempBatch.push(pendingOrders[i].wayBillNumber);

      if (tempBatch.length === parseInt(batchMaxCount) || i === pendingOrders.length - 1) {
        batches.push(tempBatch);
        tempBatch = [];
      }

    }

    for (let i = 0; i < batches.length; i++) {
      try {
        let batchUpdatedStatus = await getStatusForBatch(batches[i]);
         processBatchUpdate(batchUpdatedStatus);
      } catch (err) {
        console.log(`error while getting delivery status for waybill numbers ${batches[i]} - ${err}`);
      }
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
  let pushMessages = [];

  for (let i = 0; i < batchUpdatedStatus.length; i++) {
    try {
      let status = batchUpdatedStatus[i].shipmentStatus;
      if (terminalStatus.includes(status)) {
        let updatedOrder = await Order.findOneAndUpdate({wayBillNumber: batchUpdatedStatus[i].waybillNumber}, {
          status: status
        });

        const messageKey = (status === Status.SUCCESS) ? PushMessageKeys.CARD_DELIVERY_SUCCESSFUL : PushMessageKeys.CARD_DELIVERY_FAILED;

        const pushMessage = {
          clientId: updatedOrder.clientId, messageKey: messageKey,
          vars: {}
        };

        pushMessages.push(pushMessage);
      }
    } catch (err) {
      console.log(`error updating delivery status : ${err}`);
    }
  }

  try {
    if(pushMessages.length > 0){
      messagingService.sendBulkPush(pushMessages);
    }

  } catch (err) {
    console.log(`error sending push messages - ${err}`)
  }
};
