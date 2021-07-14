const paylaterServiceConfig = require("../config").paylaterService;
const request = require("request-promise-native");

const makeRequest = (path, method, countryCode, body = true, qs = null, headers = {}) => {
  console.log(`making request to ${paylaterServiceConfig.baseUrl}${path}`)

  const options = {
    url: `${paylaterServiceConfig.baseUrl}${path}`,
    method,
    qs: qs,
    headers: {
      'X-Entity': countryCode,
      'X-App-Version': paylaterServiceConfig.xAppVersion,
      ...headers
    },
    json: body || true,
    auth: {
      username: paylaterServiceConfig.username,
      password: paylaterServiceConfig.password
    }
  };
  return request(options)
    .then(resp => resp.response.data);
};

module.exports.getCustomerDetailsByClientId = async (clientId) => {
  return makeRequest(`/api/user/lookup/customerId/${clientId}`, "GET");
};
