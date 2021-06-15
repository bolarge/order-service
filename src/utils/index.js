const crypto = require('crypto')

module.exports = {

  generateOrderId: function () {
    return crypto.randomBytes(20).toString('hex')
  }
}
