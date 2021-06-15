/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model,
  utils = require('../utils');


module.exports.createOrder = async (body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: 'PENDING'})
  if (order) {
    console.error(`Existing order in progress for clientId: ${body.clientId}`);
    throw new Error('EXISTING_ORDER_IN_PROGRESS')
  }

  return orderModel.create({
    orderId: utils.generateOrderId(),
    clientId: body.clientId,
    deliveryId: body.deliveryId,
    orderItem: body.orderItem,
    orderStatus: 'PENDING'
  });
}
