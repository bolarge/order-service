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
    orderId: {
      type: String, required: true
    },
    type: {
      type: String,
      enum: ['CARD_ISSUANCE', 'DELIVERY'],
      required: true
    },
    status: {
      type: String, required: true
    }
  }
);

const orderItemSchema = new mongoose.Schema(schemaObj);

orderItemSchema.set('toJSON', BaseSchema.transformToJSON);

module.exports.Schema = orderItemSchema;
module.exports.Model = connection.model('OrderItem', orderItemSchema, 'orderItem');
