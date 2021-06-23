/**
 * Order.js
 *
 */

const mongoose = require('mongoose'),
  connection = require('../db/connection')

const orderSchema = mongoose.Schema(
  {
    clientId: {
      type: String, required: true
    },
    reservationId: {
      type: String, required: true
    },
    deliveryId: {
      type: String, required: true
    },
    orderItem: {
      type: Array, required: false
    },
    status: {
      type: String, required: true
    },
    paymentStatus: {
      type: String, required: true
    },
    failureMessage: {
      type: String, required: false
    }
  },
  {timestamps: true}
);


orderSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    ret.id = ret._id;
    return ret
  }
});

module.exports.Schema = orderSchema;
module.exports.Model = connection.model('Order', orderSchema, 'order');
