/**
 * Order.js
 *
 */

const mongoose = require('mongoose'),
  connection = require('../db/connection')

const orderItemSchema = mongoose.Schema(
  {
    clientId: {
      type: String, required: true
    },
    orderId: {
      type: String, required: true
    },
    name: {
      type: String, required: true
    },
    status: {
      type: String, required: true
    }
  },
  {timestamps: true}
);


orderItemSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    ret.id = ret._id;
    return ret
  }
});

module.exports.Schema = orderItemSchema;
module.exports.Model = connection.model('OrderItem', orderItemSchema, 'orderItem');
