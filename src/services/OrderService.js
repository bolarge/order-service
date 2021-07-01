/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model,
  cardService = require('../services/CardService'),
  OrderType = require('../enums').OrderType,
  Status = require('../enums').Status,
  StatusMessages = require('../enums').StatusMessages,
  orderService = require('../services/OrderService')

module.exports.createOrder = async (body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: Status.PENDING})
  const clientId = body.clientId;
  if (order) {
    console.error(`Existing order exists for clientId, {id}`, clientId);
    throw new Error('Existing order in progress')
  }
  const newOrder = {
    clientId: clientId,
    name: body.name,
    deliveryId: body.deliveryId,
    country: body.country,
    status: Status.PENDING,
    deliveryStatus: Status.PENDING,
    paymentStatus: Status.PENDING,
  }

  if (body.type === OrderType.CARD_REQUEST) {
    return orderModel.create({
      ...newOrder,
      type: OrderType.CARD_REQUEST,
      cardCreationStatus: Status.PENDING,
    });
  }
  return orderModel.create({
    ...newOrder,
    type: OrderType.DELIVERY_ONLY,
    paymentStatus: Status.PENDING,
    pickedUp: false
  });
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
    console.error(`Order with id: ${orderId} not found`);
    throw new Error('Order not found')
  }

  let failureMessage;
  let orderStatus = Status.PENDING;
  let paymentStatus = status;
  if (Status.SUCCESS !== status) {
    orderStatus = Status.FAILED
    failureMessage = StatusMessages.PAYMENT_FAILED;
  } else {
    if (OrderType.CARD_REQUEST === order.type) {
      return createCard(order, status);
    }
  }

  return orderModel.findOneAndUpdate({_id: order._id}, {
    status: orderStatus,
    paymentStatus: paymentStatus,
    failureMessage: failureMessage,
  }, {new: true})
}

async function createCard(order, status) {
  return cardService.handleCardCreation(order)
    .then(result => {
      return orderService.updateOrderWithCardInfo(result, order, status);
    })
    .catch((err) => {
      console.error(`Server error occurred => ${JSON.stringify(err.error)}`)
      return orderService.updateOrderWithCardInfo(err, order, status);
    })
}

module.exports.updateOrderWithCardInfo = async (result, order, status) => {
  const cardCreationStatus = result.cardId ? Status.SUCCESS : Status.FAILED;
  let orderStatus = Status.PENDING
  if (Status.FAILED === cardCreationStatus) {
    orderStatus = Status.FAILED;
  }
  return orderModel.findOneAndUpdate({_id: order._id}, {
    cardId: result.cardId,
    cardCreationStatus: cardCreationStatus,
    status: orderStatus,
    paymentStatus: status
  }, {new: true})
}
