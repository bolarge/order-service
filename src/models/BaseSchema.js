module.exports.baseSchemaConfig = {
  timestamps: true
}

module.exports.transformToJSON = {
  transform: function (doc, ret, opt) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
}


