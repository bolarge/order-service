/**
 * Created by Bolaji on 08/06/2021.
 *
 */
const batchService = require('../services/BatchService');
const ServiceResponse = require('../response/ServiceResponse');

module.exports = {
  uploadBatchFile: async (req, res) => {
    const {body: {file}} = req;
    return batchService.uploadBatchFile(file)
      .then((result) => {
        return res.status(200).json(new ServiceResponse(true, 'Batch file uploaded successfully', result))
      })
      .catch((err) => {
        return res.status(500).json(new ServiceResponse(false, err.message, null, [err]))
      });
  },
}
