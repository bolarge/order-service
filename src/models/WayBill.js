/**
 * WayBill.js
 * Created by Bolaji on 08/06/2021
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./BaseSchema'),
  connection = require('../db/connection')

const schemaObj = BaseSchema.getSchema(
  {
    clientId: {
      type: String, index: {unique: true}},
    wayBillNumber: {
      type: String, required: true},
    wayBillBatch: {
      type: String, required: true}
  }
);

const WayBillSchema = new mongoose.Schema(schemaObj);

WayBillSchema.set('toJSON', BaseSchema.transformToJSON);
module.exports.Schema = WayBillSchema;
module.exports.Model = connection.model('WayBill', WayBillSchema, 'waybill');
