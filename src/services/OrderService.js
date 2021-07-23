/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model;
const cardService = require('../services/CardService');
const deliveryService = require('../services/DeliveryService');
const paylaterService = require('../services/PaylaterService');
const OrderType = require('../enums').OrderType;
const Status = require('../enums').Status;
const StatusMessages = require('../enums').StatusMessages;
const csvService = require('../services/CsvService');
const fs = require('fs').promises;
const batchConfig = require('../config').batchConfig;
const messagingService = require('./MessagingService');
const s3Service = require('./S3Service');
const path = require("path");


module.exports.createOrder = async (body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: Status.ORDER_CREATED});
  const clientId = body.clientId;
  if (order) {
    console.error('Existing order exists for clientId %s', clientId);
    throw new Error('Existing order in progress')
  }

  const customerDetails = await paylaterService.getCustomerDetailsByClientId(clientId);
  const newOrder = {
    clientId: clientId,
    name: `${customerDetails.firstname} ${customerDetails.lastname}`,
    deliveryId: body.deliveryId,
    country: customerDetails.country,
    externalReference: body.internalRef
  }

  async function createCard(order) {
    return cardService.handleCardCreation(order);
  }

  const lastFailedOrder = await orderModel.findOne({clientId: body.clientId, status: Status.FAILED}).sort('-createdAt')

  if (lastFailedOrder && lastFailedOrder.cardId) {
    return orderModel.create({
      ...newOrder,
      status: Status.ORDER_CREATED,
      type: OrderType.DELIVERY_ONLY,
      cardId: lastFailedOrder.cardId
    });
  }

  const cardCreationAttempts = 1;
  try {
    const createCardResponse = await createCard(newOrder);
    return orderModel.create({
      ...newOrder,
      cardCreationAttempts,
      type: OrderType.CARD_REQUEST,
      status: Status.ORDER_CREATED,
      cardId: createCardResponse.cardId,
    });
  } catch (err) {
    console.error(`Server error occurred => ${JSON.stringify(err.message)}`);
    await orderModel.create({
      ...newOrder,
      cardCreationAttempts,
      type: OrderType.CARD_REQUEST,
      status: Status.FAILED,
      failureMessage: StatusMessages.CARD_CREATION_FAILED,
    });
    throw new Error('Card Creation failed');
  }

}

module.exports.getOrder = async (id) => {
  const order = await orderModel.findById(id)
  if (!order) {
    console.error(`Order with id: ${id} not found`);
    throw new Error('Order not found')
  }
  return order;
}


module.exports.getOrderByExternalReference = async (externalReference) => {
  const order = await orderModel.findOne({externalReference: externalReference});
  if (!order) {
    console.error(`Order with external reference: ${externalReference} not found`);
    throw new Error('Order not found')
  }
  return order;
}


module.exports.getOrderHistory = async (clientId) => {
  const orders = await orderModel.find({clientId: clientId}).sort('-createdAt')
  if (!orders.length) {
    console.error(`No order exists for clientId, %s`, clientId);
    throw new Error('No orders found')
  }
  return orders;
}

module.exports.getDeliveryInformation = async (cardId) => {
  const order = await orderModel.findOne({cardId: cardId}).sort('-createdAt')
  if (!order) {
    console.error(`No order exists for cardId, %s`, cardId);
    throw new Error('No orders found')
  }

  const deliveryServiceResponse = await deliveryService.getDeliveryInfo(order.deliveryId);
  const {clientId, name, deliveryId, country, status, paymentStatus, failureMessage} = order
  return {
    clientId, name, deliveryId, country, status, paymentStatus, failureMessage, cardId,
    id: order._id,
    deliveryAddress: deliveryServiceResponse.deliveryAddress,
    estimatedDeliveryDates: deliveryServiceResponse.estimates.deliveryDates
  }
}

module.exports.handleBatchedCustomerInformation = async (body) => {
  const {data} = body;
  if (!data.length) {
    return;
  }
  const dateNow = new Date();
  const dateFormatted = dateNow.getDate() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getFullYear();
  const fileNamePrefix = 'batched_new_delivery_csv'
  const fileName = await csvService.generateCustomerBatchCsv(fileNamePrefix, data, dateFormatted);
  const fileAsBase64String = await fs.readFile(path.resolve(__dirname, `../../${fileName}`), {encoding: 'base64'});

  const sender = batchConfig.senderEmails;
  const subject = `NEW_DELIVERY_${dateFormatted}`;
  const recipients =  batchConfig.recipientEmails.split(',');
  const recipientEmails = recipients.map((email, index) => {
    return (index === 0) ? {email} : {email, type: "cc"};
  });
  const templateName = batchConfig.templateName;
  const tags = ['order-service', 'batch-delivery']

  await messagingService.sendTemplateEmail(subject, sender, recipientEmails, templateName, tags,
    fileAsBase64String, fileName);

  s3Service.uploadFile(fileName);
}

module.exports.getRescheduleForDeliveryOnly = async () => {
  const orders = await orderModel.find({status: Status.ORDER_CREATED, type: OrderType.DELIVERY_ONLY}).sort('-createdAt');
  if (!orders.length) {
    return;
  }

  let clientInfoPromises = [];
  for (let i = 0; i < orders.length; i++) {
    clientInfoPromises.push(paylaterService.getCustomerDetailsAndAddressByOrder(orders[i]));
  }

  let customerInfoArray = [];
  await Promise.all(clientInfoPromises)
    .then(responses => responses.forEach(
      response => {
        let customerInfo = {
          customerId: response.paylaterInfo.clientId,
          customerFullName: `${response.paylaterInfo.firstname} ${response.paylaterInfo.lastname}`,
          customerGender: response.paylaterInfo.gender,
          customerPhoneNumber: response.paylaterInfo.phonenumber,
          CustomerEmail: response.paylaterInfo.email,
          cardDisplayName: `${response.paylaterInfo.firstname} ${response.paylaterInfo.lastname}`,
          deliveryAddress: response.deliveryAddress
        }
        customerInfoArray.push(customerInfo);
      }
    ));

  const dateNow = new Date();
  const dateFormatted = dateNow.getDate() + '-' + (dateNow.getMonth() + 1) + '-' + dateNow.getFullYear();
  const fileNamePrefix = 'batched_rescheduled_delivery_csv'
  const fileName = await csvService.generateCustomerBatchCsv(fileNamePrefix, customerInfoArray, dateFormatted);
  const fileAsBase64String = await fs.readFile(path.resolve(__dirname, `../../${fileName}`), {encoding: 'base64'});

  const sender = batchConfig.senderEmails;
  const subject = `RESCHEDULED_DELIVERY_${dateFormatted}`;

  const recipients =  batchConfig.recipientEmails.split(',');
  const recipientEmails = recipients.map((email, index) => {
    return (index === 0) ? {email} : {email, type: "cc"};
  });
  const templateName = batchConfig.templateName;
  const tags = ['order-service', 'batch-delivery']

  await messagingService.sendTemplateEmail(subject, sender, recipientEmails, templateName, tags,
    fileAsBase64String, fileName);

  s3Service.uploadFile(fileName);
}


