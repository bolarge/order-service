/**
 * Batch.js
 * Created by Bolaji on 08/06/2021
 */

const mongoose = require('mongoose'),
  BaseSchema = require('./BaseSchema'),
  connection = require('../db/connection')

const schemaObj = {
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

const BatchSchema = new mongoose.Schema(schemaObj, BaseSchema.baseSchemaConfig);

BatchSchema.set('toJSON', BaseSchema.transformToJSON);
module.exports.Schema = BatchSchema;
module.exports.Model = connection.model('Batch', BatchSchema, 'batch');

