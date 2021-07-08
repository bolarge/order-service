/**
 * Created by Bolaji on 08/06/2021.
 *
 */
const wayBillService = require('../services/WayBillService');
const ServiceResponse = require('../response/ServiceResponse')

module.exports = {

  createWayBill: function (req, res) {
    const {body} = req
    return wayBillService.createWayBill(body)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'WayBill created successfully', result))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },
}
