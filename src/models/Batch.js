/**
 * Batch.js
 * Created by Bolaji on 08/06/2021
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./BaseSchema'),
  connection = require('../db/connection')

const schemaObj = {
  batchId: {
    type: String, required: true, index: {unique: true}
  },
  fileHash: {
    type: String, required: true, index: {unique: true}
  },
  fileName: {
    type: String, required: true, index: {unique: true}
  },
  size: {
    type: Number
  },
}

const WayBillSchema = new mongoose.Schema(schemaObj, BaseSchema.baseSchemaConfig);

WayBillSchema.set('toJSON', BaseSchema.transformToJSON);
module.exports.Schema = WayBillSchema;
module.exports.Model = connection.model('Batch', WayBillSchema, 'batch');

