const ServiceResponse = require('../response/ServiceResponse')


module.exports = {
  healthCheck: function (req, res) {
    return res.status(200).json(new ServiceResponse( true, 'SERVICE_UP', null ))
  }
}

