/**
 * Order.js
 *
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./BaseSchema'),
  connection = require('../db/connection'),
  Status = require('../enums').Status,
  Type = require('../enums').OrderType;


const schemaObj = {
  clientId: {
    type: String, required: true
  },
  name: {
    type: String, required: true
  },
  externalReference: {
    type: String, required: true
  },
  country: {
    type: String, required: true
  },
  deliveryId: {
    type: String, required: true
  },
  type: {
    type: String,
    enum: [Type.CARD_REQUEST, Type.DELIVERY_ONLY],
    required: true
  },
  status: {
    type: String,
    enum: [Status.ORDER_CREATED, Status.IN_TRANSIT, Status.SUCCESS, Status.FAILED],
    required: true
  },
  failureMessage: {
    type: String
  },
  cardCreationAttempts: {
    type: Number,
    required: false,
    default: 0
  },
  cardId: {
    type: String
  }
}

const orderSchema = new mongoose.Schema(schemaObj, BaseSchema.baseSchemaConfig);

orderSchema.set('toJSON', BaseSchema.transformToJSON);

module.exports.Schema = orderSchema;
module.exports.Model = connection.model('Order', orderSchema, 'order');
