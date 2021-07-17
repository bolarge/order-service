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
const s3Service = require('./S3Service')
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
    name: customerDetails.firstname + customerDetails.lastname,
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
  const fileName = await csvService.generateBatchCsv(data);
  const fileAsBase64String = await fs.readFile(__dirname + `/${fileName}`, {encoding: 'base64'});

  const sender = batchConfig.senderEmails;
  const subject = batchConfig.emailSubject;
  const recipientEmails = batchConfig.recipientEmails.map((email, index) => {
    return (index == 0) ? { email }: {email, type: "cc"};
  });
  const templateName = batchConfig.templateName;
  const tags = ['order-service', 'batch-delivery']
  const globalmergeVars = [{name: "batchDate", content: Date.now()}];

  await messagingService.sendTemplateEmail(subject, sender, recipientEmails, templateName, tags, globalmergeVars,
    fileAsBase64String, fileName);

  await s3Service.uploadFile(fileName);
}

module.exports.getRescheduleForDeliveryOnly = async () => {
  const orders = await orderModel.find({status: Status.FAILED, type: OrderType.DELIVERY_ONLY}, 'clientId', {sort : {createdAt : -1}},
    function (err, orders){ if (err){console.log(err);} });

  let clientIdArray = [];
  let i = 0;
  if(orders){
    for (const order in orders) {
      clientIdArray[i++] = orders[order].clientId;
    }
  }

  let j = 0;
  let clientsDetailsArray = [];
  for (const clientId in clientIdArray){
    const customerDetails = await paylaterService.getCustomerDetailsByClientId(clientIdArray[clientId]);
    const client = {
      customerId: customerDetails.clientId,
      customerFullName: customerDetails.firstname + " " +customerDetails.lastname,
      customerGender: customerDetails.gender,
      customerPhoneNumber: customerDetails.phonenumber,
      CustomerEmail: customerDetails.email,
      cardDisplayName: customerDetails.firstname + customerDetails.lastname,
      deliveryAddress: customerDetails.address
    }
    clientsDetailsArray[j++] = client;
  }

  //Problem occurs when file is not readable on 177
  const csvFilePath = path.join(__dirname, '../');
  const fileName = await csvService.generateBatchCsv(clientsDetailsArray);
  console.log('Directory is ' + __dirname);
  const fileAsBase64String = await fs.readFile(csvFilePath + `${fileName}`, {encoding: 'base64'});
  console.log('What is ' + fileName);
  console.log('Does is ' + fileAsBase64String);

  const sender = batchConfig.senderEmails;
  const subject = batchConfig.emailSubject;
  const recipientEmails = batchConfig.recipientEmails.map((email, index) => {
    return (index == 0) ? { email }: {email, type: "cc"};
  });
  const templateName = batchConfig.templateName;
  const tags = ['order-service', 'batch-delivery']
  const globalmergeVars = [{name: "batchDate", content: Date.now()}];

  await messagingService.sendTemplateEmail(subject, sender, recipientEmails, templateName, tags, globalmergeVars,
    fileAsBase64String, fileName);

  await s3Service.uploadFile(fileName);

}


