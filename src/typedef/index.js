/**
 * Created by Oghenerukevwe
 */

/**
 * @typedef CreateCardRequest
 *
 * @property {Object} cardHolder
 * @property {String} reservationId
 * @property {Number} amount
 * @property {String} country
 * @property {String} type
 * @property {String} currency
 * @property {String} classification
 */

/**
 * @typedef CreateCardResponse
 *
 * @property {boolean} status
 * @property {String} errorCode
 * @property {String} message
 * @property {Object} data
 * @property {String} type
 * @property {String} currency
 * @property {String} classification
 */

/**
 * @typedef CardHolder
 *
 * @property {String} id
 * @property {String} name
 */

/**
 * @typedef ReservationRequest
 *
 * @property {Object} cardHolder
 * @property {String} country
 * @property {Object} ReservableParameters
 * @property {String} reservationType
 * @property {String} cardType
 */
