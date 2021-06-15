const orderModel = require('../models/Order').Model,
  utils = require('../utils');


module.exports.createOrder = async (clientId, body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: 'PENDING'})
  if (order) {
    console.error(`Existing order in progress for clientId: ${clientId}`);
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

module.exports.getOrder = async (orderId) => {
  const order = await orderModel.findOne({orderId: orderId})
  if (!order) {
    console.error(`Order with orderId: ${orderId} not found`);
    throw new Error('ORDER_NOT_FOUND')
  }
  return order;
}
