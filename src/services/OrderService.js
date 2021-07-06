/**
 * Created by oghenerukevwe on 15/06/2021.
 */

const orderModel = require('../models/Order').Model,
  cardService = require('../services/CardService'),
  OrderType = require('../enums').OrderType,
  Status = require('../enums').Status,
  StatusMessages = require('../enums').StatusMessages,
  MAX_CARD_CREATION_ATTEMPTS = 2;


module.exports.createOrder = async (body) => {
  const order = await orderModel.findOne({clientId: body.clientId, status: Status.ORDER_CREATED})
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
    status: Status.ORDER_CREATED,
  }

  if (OrderType.CARD_REQUEST === body.type) {
    return orderModel.create({
      ...newOrder,
      type: OrderType.CARD_REQUEST,
    });
  }
  const lastFailedOrder = await orderModel.findOne({clientId: body.clientId, status: Status.FAILED}).sort('-createdAt')
  return orderModel.create({
    ...newOrder,
    type: OrderType.DELIVERY_ONLY,
    cardId: lastFailedOrder.cardId
  });
}

module.exports.getOrder = async (id) => {
  const order = await orderModel.findById(id)
  if (!order) {
    console.error(`Order with id: ${id} not found`);
    throw new Error('Order not found')
  }
  if (OrderType.CARD_REQUEST === order.type && Status.SUCCESS === order.paymentStatus && !order.cardId) {
    if (order.cardCreationAttempts < MAX_CARD_CREATION_ATTEMPTS) {
      try {
        const createCardResponse = await createCard();
        return orderModel.findOneAndUpdate({_id: order._id}, {
          cardId: createCardResponse.cardId,
        }, {new: true})
      } catch (err) {
        console.error(`Server error occurred => ${JSON.stringify(err.error)}`)
        return orderModel.findOneAndUpdate({_id: order._id}, {
          status: Status.FAILED,
          cardCreationAttempts: order.cardCreationAttempts + 1
        }, {new: true})
      }
    }
  }
  return order;
}

module.exports.updateOrderPaymentStatus = async (orderId, status) => {
  const order = await orderModel.findById(orderId);
  if (!order) {
    console.error(`Order with id: ${orderId} not found`);
    throw new Error('Order not found')
  }

  if (order.paymentStatus) {
    throw new Error('Payment status is already updated')
  }

  if (Status.SUCCESS === status) {
    const paymentStatus = Status.SUCCESS;
    const cardCreationAttempts = order.cardCreationAttempts + 1;
    if (OrderType.CARD_REQUEST === order.type) {
      try {
        const createCardResponse = await createCard(order);
        return orderModel.findOneAndUpdate({_id: order._id}, {
          paymentStatus,
          cardCreationAttempts,
          cardId: createCardResponse.cardId,
        }, {new: true})
      } catch (err) {
        console.error(`Server error occurred => ${JSON.stringify(err.error)}`)
        await orderModel.findOneAndUpdate({_id: order._id}, {
          paymentStatus,
          cardCreationAttempts,
        })
        throw new Error('Card Creation failed');
      }
    }
  } else {
    return orderModel.findOneAndUpdate({_id: order._id}, {
      paymentStatus: Status.FAILED,
      status: Status.FAILED,
      failureMessage: StatusMessages.PAYMENT_FAILED,
    })
  }
}

async function createCard(order) {
  return cardService.handleCardCreation(order);
}

module.exports.getOrderHistory = async (clientId) => {
  const orders = await orderModel.find({clientId: clientId}).sort('-createdAt')
  if (!orders.length) {
    console.error(`No order exists for clientId, {}`, clientId);
    throw new Error('No orders found')
  }
  return orders;
}
