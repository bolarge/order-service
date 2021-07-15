/**
 * Created by Bolaji on 08/06/2021.
 *
 */

const batchModel = require('../models/Batch').Model;
const orderModel = require('../models/Order').Model;
const Utils = require('../utils');
const csvToJson = require('csvtojson');
const Status = require('../enums').Status;
const PushMessageKeys = require('../enums').PushMessageKeys;
const messagingService = require('./MessagingService');
const deliveryConfig = require('../config').delivery;


module.exports.uploadBatchFile = async (fileAsBase64String, uploadFileName) => {

  const fileHash = Utils.computeCheckSum(fileAsBase64String);
  const dateNow = new Date().toISOString();
  const batch = await batchModel.findOne({fileHash: fileHash});
  if (batch) {
    console.error('File batch already exists ', dateNow);
    throw new Error('Batch already exists')
  }

  /** csv expected format
   * Client ID, Waybill Number
   * 12448193, 20
   * 27493022, 10
   */

  const fileName = dateNow + '_' + Utils.generateRandomString();
  let batchSize = 0;
  let bulkRequest = [];
  let buff = new Buffer(fileAsBase64String, 'base64');
  let text = buff.toString('ascii');
  try {
    const fileArray = await csvToJson().fromString(text);
    batchSize = fileArray.length;

    for (let i = 0; i < fileArray.length; i++) {
      let clientId = fileArray[i]['Client ID'];
      let order = await orderModel.findOne({
        clientId: clientId,
        status: Status.ORDER_CREATED,
        waybillNumber: null
      })
        .sort('-createdAt');

      if (!order) {
        console.log('Batch Upload - Order with clientId %s not found', clientId);
        continue;
      }
      await orderModel.findByIdAndUpdate(order._id, {
        status: Status.IN_TRANSIT,
        wayBillNumber: fileArray[i]['Waybill Number']
      });

      const bulkData = {
        clientId: clientId, messageKey: PushMessageKeys.CARD_ORDER_IN_TRANSIT,
        vars: {earliestTime: deliveryConfig.earliestTime, latestTime: deliveryConfig.latestTime}
      };

      bulkRequest.push(bulkData);
    }

    console.log('Done parsing batch information')

    if (bulkRequest.length) {
      messagingService.sendBulkPush(bulkRequest);
    }else {
      throw new Error("Unable to update order status. Check that clientIds are valid.")
    }
    return batchModel.create({
      fileHash,
      fileName,
      uploadFileName,
      size: batchSize
    });
  } catch (err) {
    console.log('Error occurred while processing batch on date: ', new Date(Date.now()), err.message)
    throw new Error('Error while processing batch: ' + err.message);
  }

}
