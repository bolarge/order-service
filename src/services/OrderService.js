/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model,
  orderItemModel = require('../models/OrderItem').Model,
  cardService = require('../services/CardService'),
  OrderItem = require('../enums').OrderItem,
  OrderStatus = require('../enums').OrderStatus,
  StatusMessages = require('../enums').StatusMessages,
  orderService = require('../services/OrderService')

module.exports.createOrder = async (body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: orderStatus.PENDING})
  if (order) {
    console.error(`Existing order in progress for clientId: ${body.clientId}`);
    throw new Error('EXISTING_ORDER_IN_PROGRESS')
  }

  const savedOrder = await orderModel.create({
    clientId: body.clientId,
    deliveryId: body.deliveryId,
    orderItem: body.orderItem,
    reservationId: body.reservationId,
    orderStatus: orderStatus.PENDING
  });

  const orderItem = body.orderItem;
  if (!orderItem || !orderItem.length)
    order.orderItem.forEach(function (item) {
      orderItemModel.create({
        orderId: savedOrder._id,
        clientId: savedOrder.clientId,
        item: item.type,
        status: item.status
      })
    });

  return savedOrder;
}

module.exports.getOrder = async (id) => {
  const order = await orderModel.findById(id)
  if (!order) {
    console.error(`Order with id: ${id} not found`);
    throw new Error('ORDER_NOT_FOUND')
  }
  return order;
}

module.exports.updateOrderPaymentStatus = async (orderId, status) => {
  const order = await orderModel.findById(orderId);
  if (!order) {
    console.error(`Order with orderId: ${orderId} not found`);
    throw new Error('ORDER_NOT_FOUND')
  }
  if (OrderStatus.SUCCESS === status) {
    let orderItem = orderItemModel.findOne({orderId: order._id}, {item: OrderItem.CARD_ISSUANCE}, {status: OrderStatus.PENDING})
    cardService.create(order)
      .then(result => {
        let status;
        if (result.status) {
          status = OrderStatus.SUCCESS
          orderItemModel.findOneAndUpdate({_id: orderItem._id}, {paymentStatus: status});
        } else {
          status = OrderStatus.FAILED
          orderItemModel.findOneAndUpdate({_id: orderItem._id}, {paymentStatus: status});
        }
        orderService.updateOrderStatus(order);
      })
      .catch(() => {
        throw new Error('CARD_CREATION_FAILED')
      })
  }
  return orderModel.findOneAndUpdate({_id: orderId}, {orderStatus: status}, {new: true})
}

module.exports.updateOrderStatus = async (order) => {
  const orderItems = orderItemModel.find({orderId: order._id});
  const itemsLength = orderItems.length;
  let successCount;
  let failureMessage;
  let status = OrderStatus.SUCCESS;

  orderItems.forEach(item => {
    if (OrderStatus.FAILED === item.status) {
      status = OrderStatus.FAILED;
      if (OrderItem.CARD_ISSUANCE == orderItem.name) {
        failureMessage = StatusMessages.CARD_ISSUANCE_FAILED;
      } else {
        failureMessage = StatusMessages.DELIVERY_FAILED;
      }
      return;
    }
    if (OrderStatus.SUCCESS === item.status) {
      successCount += 1;
    }
  })

  if (successCount < itemsLength) {
    status = OrderStatus.PENDING;
  }

  return orderModel.findOneAndUpdate({_id: order._id}, {
    status: status,
    failureMessage: failureMessage
  }, {new: true})
}
