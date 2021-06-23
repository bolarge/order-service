const orderService = require('../services/OrderService');
const ServiceResponse = require('../response/ServiceResponse')

module.exports = {

  createOrder: function (req, res) {
    const { body } = req
    return orderService.createOrder( body )
      .then((result) => {
        return res.status(200).json(new ServiceResponse( true, 'ORDER_CREATE_SUCCESS', result ))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse( false, err.message, null, [err] ))
      });
  },

  getOrder: function(req, res) {
    const orderId = req.params.orderId;
    return orderService.getOrder(orderId)
      .then((result) => {
        const {orderStatus, id} = result;
        return res.status(200).json(new ServiceResponse( true, 'ORDER_FOUND', {id, orderStatus} ))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse( false, err.message, null, [err] ))
      });
  },

  updateOrderPaymentStatus: function (req, res) {
    const {params: {orderId}, body: {status}} = req
    return orderService.updateOrderPaymentStatus(orderId, status)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'ORDER_UPDATED_SUCCESSFULLY', result))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  }
}

