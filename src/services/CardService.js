const request = require('request-promise-native'),
  cardServiceConfig = require('../config').cardService,
  Utils = require('../utils'),
  CARD_CREATION_RESERVATION_TYPE = 'CARD_CREATION',
  CARD_CLASSIFICATION_TYPE = 'DEBIT'


/**
 * @param path {string}
 * @param method {string}
 * @param countryCode {string}
 * @param body {object | null}
 * @param qs {object | null}
 * @param headers {object | null}
 */
const makeRequest = (path, method, countryCode, body = true, qs = null, headers = {}) => {
  console.log(`making request to ${cardServiceConfig.baseUrl}${path}`)

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

const initiateReservation = (order, countryConfig) => {
  const reservationRequest = {
    cardHolder: {
      id: order.clientId,
      name: order.name
    },
    reservableParameters: {
      accountCurrency: countryConfig.currencyCode,
      cardCurrency: countryConfig.currencyCode,
    },
    cardType: cardServiceConfig.cardType,
    country: order.country,
    reservationType: CARD_CREATION_RESERVATION_TYPE
  };
  console.log(reservationRequest);
  return makeRequest(`/cardholders/${order.clientId}/cards/initiate-action`, "POST", order.country, reservationRequest);
};

const createCard = (order, countryConfig, reservationResponse) => {
  const createCardRequest = {
    cardHolder: {
      id: order.clientId,
      name: order.name
    },
    type: cardServiceConfig.cardType,
    classification: CARD_CLASSIFICATION_TYPE,
    country: countryConfig.code,
    reservationId: reservationResponse.id,
    currency: countryConfig.currencyCode
  };


  return makeRequest(`/cardholders/${createCardRequest.cardHolder.id}/cards`,
    "POST", createCardRequest.country, createCardRequest);
};

/**
 * Create a new card
 * @param order {object}
 * @return {Promise<any>}
 */
module.exports.handleCardCreation = async (order) => {
  const countryConfig = Utils.getCountryConfig(order.country);

  const reservationResponse = await initiateReservation(order, countryConfig);

  console.log(reservationResponse);

  return await createCard(order, countryConfig, reservationResponse);
};
