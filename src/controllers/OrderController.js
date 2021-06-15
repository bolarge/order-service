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
  }
}

