const orderController = require('../controllers/OrderController'),
  healthController = require('../controllers/HealthController'),
  batchController = require('../controllers/BatchController')

module.exports = function (app) {

  ///////////////////////////
  // HEALTH CHECK ROUTES
  ///////////////////////////
  app.get('/health', healthController.healthCheck);

  ///////////////////////////
  // ORDER ROUTES
  ///////////////////////////
  app.post('/v1/orders', orderController.createOrder);
  app.get('/v1/orders/:orderId', orderController.getOrder);
  app.get('/v1/orders/history/:clientId', orderController.getOrderHistory)
  app.get('/v1/orders/delivery/:cardId', orderController.getCardDeliveryInformation)
  app.get('/v1/orders/external-ref/:externalReference', orderController.getOrderByExternalReference)


  ///////////////////////////
  // WAYBILL ROUTES
  ///////////////////////////
  app.post('/v1/batch/upload', batchController.uploadBatchFile);
}
