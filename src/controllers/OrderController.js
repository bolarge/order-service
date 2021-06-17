const OrderService = require('../services/OrderService');
const ServiceResponse = require('../response/ServiceResponse')

module.exports = {

  createOrder: function (req, res) {
    const { body } = req
    return OrderService.createOrder( body )
      .then((result) => {
        return res.status(200).json(new ServiceResponse( true, 'ORDER_CREATE_SUCCESS', result ))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse( false, err.message, null, [err] ))
      });
  },

  getOrder: function(req, res) {
    const orderId = req.params.orderId;
    return OrderService.getOrder(orderId)
      .then((result) => {
        const {orderStatus, id} = result;
        return res.status(200).json(new ServiceResponse( true, 'ORDER_FOUND', {id, orderStatus} ))
      })
      .catch((err) => {
        return res.status(400).json(new ServiceResponse( false, err.message, null, [err] ))
      });
  },

  updateOrder: function (req, res) {
    const {params: {orderId}, body: {status}} = req
    return OrderService.updateOrder(orderId, status)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'ORDER_UPDATED_SUCCESSFULLY', result))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  }
}

