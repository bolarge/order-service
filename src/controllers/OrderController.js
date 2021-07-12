const orderService = require('../services/OrderService');
const ServiceResponse = require('../response/ServiceResponse')

module.exports = {

  createOrder: function (req, res) {
    const {body} = req
    return orderService.createOrder(body)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Order created successfully', result))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },

  getOrder: function (req, res) {
    const orderId = req.params.orderId;
    return orderService.getOrder(orderId)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Retrieved order successfully', result))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },

  getOrderHistory: function (req, res) {
    const clientId = req.params.clientId;
    return orderService.getOrderHistory(clientId)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Retrieved list of orders successfully', result))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },

  getCardDeliveryInformation: function (req, res) {
    const cardId = req.params.cardId;
    return orderService.getDeliveryInformation(cardId)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Retrieved card delivery information successfully', result))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },

  getOrderByExternalReference: function (req, res) {
    const externalReference = req.params.externalReference;
    return orderService.getOrderByExternalReference(externalReference)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Retrieved order successfully', result))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },
}
