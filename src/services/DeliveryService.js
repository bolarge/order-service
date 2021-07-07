const deliveryServiceConfig = require("../config").deliveryService,
  request = require("request-promise-native");

const makeRequest = (path, method, countryCode, body = true, qs = null, headers = {}) => {
  console.log(`making request to ${deliveryServiceConfig.baseUrl}${path}`)

  const options = {
    url: `${deliveryServiceConfig.baseUrl}${path}`,
    method,
    qs: qs,
    json: body || true,
  };
  return request(options);
};

module.exports.getDeliveryInfo = async (deliveryId) => {
  return makeRequest(`/v1/delivery-info/${deliveryId}`, "GET");
};
