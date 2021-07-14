module.exports.Status = {
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  ORDER_CREATED: 'ORDER_CREATED',
  IN_TRANSIT: 'IN_TRANSIT'
}

module.exports.OrderType = {
  CARD_REQUEST: 'CARD_REQUEST',
  DELIVERY_ONLY: 'DELIVERY_ONLY'
}

module.exports.StatusMessages = {
  CARD_CREATION_FAILED: 'Failed to create card',
  DELIVERY_FAILED: 'Failed to deliver card',
}

module.exports.PushMessageKeys = {
  CARD_ORDER_IN_TRANSIT: 'CARD_ORDER_IN_TRANSIT',
}

