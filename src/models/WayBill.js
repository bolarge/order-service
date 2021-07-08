/**
 * WayBill.js
 *
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./BaseSchema'),
  connection = require('../db/connection')

const schemaObj = BaseSchema.getSchema(
  {
    clientId: {
      type: String, index: {unique: true}},
    number: {
      type: String, required: true},
    batch: {
      type: String, required: true}
  }
);

const WayBillSchema = new mongoose.Schema(schemaObj);

WayBillSchema.set('toJSON', BaseSchema.transformToJSON);

module.exports.Schema = WayBillSchema;
module.exports.Model = connection.model('WayBill', WayBillSchema, 'waybill');
