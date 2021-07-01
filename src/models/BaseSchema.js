const baseSchema = {
  createdAt: {
    type: Date,
    default: Date.now()
  },

  updatedAt: {
    type: Date,
    default: Date.now()
  },
};

module.exports.getSchema = (objectSchema) => {
  const copy = Object.assign({}, objectSchema || {});
  return Object.assign(copy, baseSchema);
};

module.exports.transformToJSON = {
  transform: function (doc, ret, opt) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.cardCreationStatus;
    return ret;
  }
}


