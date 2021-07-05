/**
 * Order.js
 *
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./BaseSchema'),
  connection = require('../db/connection')


const schemaObj = BaseSchema.getSchema(
  {
    clientId: {
      type: String, required: true
    },
    name: {
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
      enum: ['CARD_REQUEST', 'DELIVERY_ONLY'],
      required: true
    },
    status: {
      type: String,
      enum:['PENDING', 'SUCCESS', 'FAILED'],
      required: true
    },
    paymentStatus: {
      type: String,
      enum:['PENDING', 'SUCCESS', 'FAILED'],
      required: true
    },
    deliveryStatus: {
      type: String,
      enum:['PENDING', 'SUCCESS', 'FAILED', 'IN_PROGRESS'],
      required: true
    },
    failureMessage: {
      type: String
    },
    cardId: {
      type: String
    }
  }
);

const orderSchema = new mongoose.Schema(schemaObj);

orderSchema.set('toJSON', BaseSchema.transformToJSON);

module.exports.Schema = orderSchema;
module.exports.Model = connection.model('Order', orderSchema, 'order');
