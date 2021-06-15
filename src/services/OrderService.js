const orderModel = require('../models/Order').Model,
  utils = require('../utils');


module.exports.createOrder = async (clientId, body) => {
  const order = await orderModel.findOne({clientId: clientId, status: 'PENDING'})
  if (order) {
    console.error(`Existing order in progress for clientId: ${clientId}`);
    throw new Error('EXISTING_ORDER_IN_PROGRESS')
  }

  return orderModel.create({
    orderId: utils.generateOrderId(),
    clientId: clientId,
    deliveryId: body.deliveryId,
    orderItem: body.orderItem,
    orderStatus: 'PENDING'
  });
}
