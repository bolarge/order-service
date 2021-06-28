/**
 * Order.js
 *
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./baseSchema'),
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
    status: {
      type: String, required: true
    },
    paymentStatus: {
      type: String, required: true
    },
    failureMessage: {
      type: String, required: false
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
