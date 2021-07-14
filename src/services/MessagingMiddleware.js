const messagingMiddlewareConfig = require("../config").messagingMiddleware
const request = require("request-promise-native");
const countryConfig = require("../config").countryConfig;

const makeRequest = (path, method, body, qs, headers = {}) => {

  console.log(`making request to ${messagingMiddlewareConfig.baseUrl}${path}`)

  const options = {
    url: messagingMiddlewareConfig.baseUrl + path,
    method,
    qs: qs || null,
    headers: headers || {},
    json: body || true,
  };
  return request(options);
};


module.exports.sendBulkPush = async (bulkRequest) => {
  return makeRequest('/bulk-push', 'POST',
    {bulkRequest: bulkRequest},
    null, {'X-Entity': countryConfig.ng.code, 'X-Locale-Lang': null});
};
