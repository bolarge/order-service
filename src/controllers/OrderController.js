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
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },

  updateOrderPaymentStatus: function (req, res) {
    const {params: {orderId}, body: {status}} = req
    return orderService.updateOrderPaymentStatus(orderId, status)
      .then((result) => {
        const {id, type, paymentStatus, status} = result;
        return res.status(200).json(new ServiceResponse(true, 'Order payment status updated successfully', {
          id, type, status, paymentStatus
        }))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  }
}

