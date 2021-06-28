/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model,
  orderItemModel = require('../models/OrderItem').Model,
  cardService = require('../services/CardService'),
  OrderItemType = require('../enums').OrderItemType,
  Status = require('../enums').Status,
  StatusMessages = require('../enums').StatusMessages,
  orderService = require('../services/OrderService')

module.exports.createOrder = async (body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: Status.PENDING})
  if (order) {
    console.error(`Existing order in progress for clientId: ${body.clientId}`);
    throw new Error('EXISTING_ORDER_IN_PROGRESS')
  }

  const savedOrder = await orderModel.create({
    clientId: body.clientId,
    name: body.name,
    deliveryId: body.deliveryId,
    country: body.country,
    reservationId: body.reservationId,
    status: Status.PENDING,
    paymentStatus: Status.PENDING,
  });

  const orderItems = body.orderItems;
  if (orderItems) {
    for (const item of orderItems) {
      await orderItemModel.create({
        orderId: savedOrder._id,
        clientId: savedOrder.clientId,
        type: item.type,
        status: Status.PENDING
      });
    }
  }
  return savedOrder;
}

module.exports.getOrder = async (id) => {
  const order = await orderModel.findById(id)
  if (!order) {
    console.error(`Order with id: ${id} not found`);
    throw new Error('Order not found')
  }
  return order;
}

module.exports.updateOrderPaymentStatus = async (orderId, status) => {
  const order = await orderModel.findById(orderId);
  if (!order) {
    console.error(`Order with orderId: ${orderId} not found`);
    throw new Error('Order not found')
  }
  if (Status.SUCCESS === status) {
    let orderItem = await orderItemModel.findOne({orderId: order._id}, {type: OrderItemType.CARD_ISSUANCE}, {status: Status.PENDING})
    if (orderItem) {
      return cardService.handleCardCreation(order)
        .then(result => {
          console.log(result);
          orderItemModel.findOneAndUpdate({_id: orderItem._id}, {status: Status.SUCCESS});
          return orderService.updateOrderStatus(result, order);
        })
        .catch((err) => {
          orderItemModel.findOneAndUpdate({_id: orderItem._id}, {paymentStatus: Status.FAILED});
          console.error(`Server error occurred => ${JSON.stringify(err.error)}`)
          throw new Error('Card Creation failed')
        })
    }
  }
}

module.exports.updateOrderStatus = async (result, order) => {
  const orderItems = orderItemModel.find({orderId: order._id});
  const itemsLength = orderItems.length;
  let successCount;
  let failureMessage;
  let status = Status.SUCCESS;

  orderItems.forEach(item => {
    if (Status.FAILED === item.status) {
      status = Status.FAILED;
      if (OrderItemType.CARD_ISSUANCE === item.name) {
        failureMessage = StatusMessages.CARD_ISSUANCE_FAILED;
      } else {
        failureMessage = StatusMessages.DELIVERY_FAILED;
      }
      return;
    }
    if (Status.SUCCESS === item.status) {
      successCount += 1;
    }
  })

  if (successCount < itemsLength) {
    status = Status.PENDING;
  }

  return orderModel.findOneAndUpdate({_id: order._id}, {
    status: status,
    failureMessage: failureMessage,
    cardId: result.cardId
  }, {new: true})
}
