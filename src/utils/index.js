const config = require('../config');
const md5 = require('blueimp-md5');

module.exports = {
  getCountryConfig: function (countryCode) {
    return config.countryConfig[countryCode.toLowerCase()];
  },

  convertByTeArrayToHexString: function (byteArray) {
    let s = '0x';
    byteArray.forEach(function (byte) {
      s += ('0' + (byte & 0xFF).toString(16)).slice(-2);
    });
    return s;
  },

  computeCheckSum: function (base64String) {
    return md5(base64String);
  },

  generateRandomString: function (length) {
    length = !length ? 5 : length;
    return Math.random().toString(36).substr(2, length);
  },

  convertByteArrayToAsciiString: function (byteArray) {
    return String.fromCharCode.apply(null, byteArray);
  }
}
