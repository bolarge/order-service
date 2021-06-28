const deliveryService = require('../services/DeliveryService');
const ServiceResponse = require('../response/ServiceResponse')


module.exports = {

  getDeliveryAddress: function (req, res) {
    const cardId = req.params.cardId;
    return deliveryService.getDeliveryAddress(cardId)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Retrieved delivery address successfull', result))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  }
}
