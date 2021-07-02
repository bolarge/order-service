const config = require('../config')

module.exports = {
  getCountryConfig: function (countryCode) {
    return config.countryConfig[countryCode.toLowerCase()]
  }
}
