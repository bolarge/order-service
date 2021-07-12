/**
 * Created by Bolaji on 08/06/2021.
 *
 */
const wayBillService = require('../services/WayBillService');
const ServiceResponse = require('../response/ServiceResponse')
const uploadMiddleware = require('../utils/uploadMiddleware')

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

  uploadWayBill: async (req, res) => {
    try {
      await uploadMiddleware(req, res);

      if (req.file == undefined) {
        return res.status(400).send({ message: "Choose a file to upload" });
      }

      res.status(200).send({
        message: "File uploaded successfully: " + req.file.originalname,
      });
    } catch (err) {
      console.log(err);

      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size should be less than 5MB",
        });
      }

      res.status(500).send({
        message: `Error occured: ${err}`,
      });
    }
  },
}
