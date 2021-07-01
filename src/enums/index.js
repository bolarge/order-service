module.exports.Status = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  IN_PROGRESS: 'IN_PROGRESS'
}

module.exports.OrderType = {
  CARD_REQUEST: 'CARD_REQUEST',
  DELIVERY_ONLY: 'DELIVERY_ONLY'
}

module.exports.StatusMessages = {
  CARD_ISSUANCE_FAILED: 'Failed to create card',
  DELIVERY_FAILED: 'Failed to deliver card',
  PAYMENT_FAILED: 'Order payment failed'
}
