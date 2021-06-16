/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model,
  utils = require('../utils');


module.exports.createOrder = async (body) => {
  const order = await orderModel.find({clientId: body.clientId, status: 'PENDING'})
  if (order) {
    console.error(`Existing order in progress for clientId: ${body.clientId}`);
    throw new Error('EXISTING_ORDER_IN_PROGRESS')
  }

  return orderModel.create({
    clientId: body.clientId,
    deliveryId: body.deliveryId,
    orderItem: body.orderItem,
    reservationId: body.reservationId,
    orderStatus: 'PENDING'
  });
}

module.exports.getOrder = async (id) => {
  const order = await orderModel.findById(id)
  if (!order) {
    console.error(`Order with id: ${id} not found`);
    throw new Error('ORDER_NOT_FOUND')
  }
  return order;
}
