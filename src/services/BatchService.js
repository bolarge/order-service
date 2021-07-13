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
const messagingMiddleware = require('../services/MessagingMiddleware');
const deliveryConfig = require('../config').delivery;


module.exports.uploadBatchFile = async (file) => {

  const fileHash = Utils.computeCheckSum(file);
  const dateNow = Date.now();
  const batch = batchModel.findOne({fileHash: fileHash});
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
  try {
    csvToJson().fromString(file.toString('utf8'))
      .on('json', (fileData) => {
        batchSize = fileData.length;
        if (fileData.length) {
          fileData.forEach(async data => {
            let clientId = data['Client ID'];
            let order = await orderModel.findOne({
              clientId: clientId,
              status: Status.ORDER_CREATED, waybillNumber: null
            }).sort('-createdAt');

            await orderModel.findByIdAndUpdate(order._id, {
              status: Status.IN_TRANSIT,
              wayBillNumber: data['Waybill Number']
            });

            const bulkData = {clientId: clientId, messageKey: PushMessageKeys.CARD_ORDER_IN_TRANSIT,
              vars: {earliestTime: deliveryConfig.earliestTime, latestTime: deliveryConfig.latestTime}};

            bulkRequest.push(bulkData);
          })
        }
      })
      .on('done', () => {
        console.log('Done parsing batch information')
      })

    await messagingMiddleware.sendBulkPush(bulkRequest);

    return batchModel.create({
      fileHash,
      fileName,
      size: batchSize
    });

  } catch (err) {
    console.log('Error occurred while processing batch on date: ', new Date(Date.now()))
    throw new Error('Error while processing batch');
  }

}
