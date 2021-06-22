const request = require('request-promise'),
cardServiceConfig = require('../config').cardService,
  DEFAULT_CARD_TYPE = 'PHYSICAL',
  DEFAULT_CARD_CLASSIFICATION = 'DEBIT',
  DEFAULT_COUNTRY = 'NG',
  DEFAULT_CURRENCY = 'NGN'


/**
 * @param path {string}
 * @param method {string}
 * @param countryCode {string}
 * @param body {object | null}
 * @param qs {object | null}
 * @param headers {object | null}
 */
const makeRequest = (path, method, countryCode, body = true, qs = null, headers = {}) => {
  const options = {
    url: `${cardServiceConfig.baseUrl}${path}`,
    method,
    qs: qs,
    headers: {'X-Entity': countryCode, ...headers},
    json: body || true,
    auth: {
      username: cardServiceConfig.username,
      password: cardServiceConfig.password
    }
  };
  return request(options)
    .then(resp => resp.data);
};

/**
 * Create card on cards service
 * @param createCardRequest {{country: string, reservationId: (Object.reservationId|{type: StringConstructor, required: boolean}), cardHolderId: ({type: StringConstructor, required: boolean}|string), currency: {code: string}, type: string, classification: string}}
 * @returns {Promise<Card>}
 */
const createCard = (createCardRequest) => {
  return makeRequest(`/cardholders/${createCardRequest.cardHolderId}/cards`, "POST", createCardRequest.country, createCardRequest);
};

/**
 * Create a new card
 * @param order {object}
 * @return {Promise<any>}
 */
module.exports.create = async (order) => {
  const createCardRequest = {
    cardHolderId: order.clientId,
    type: DEFAULT_CARD_TYPE,
    classification: DEFAULT_CARD_CLASSIFICATION,
    country: DEFAULT_COUNTRY,
    reservationId: order.reservationId,
    currency: {
      code: DEFAULT_CURRENCY
    }
  };
  return await createCard(createCardRequest);
};
