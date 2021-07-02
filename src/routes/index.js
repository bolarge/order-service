const orderController = require('../controllers/OrderController'),
  healthController = require('../controllers/HealthController')

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
  app.put('/v1/orders/:orderId/payment', orderController.updateOrderPaymentStatus);
  app.get('/v1/orders/history/:clientId', orderController.getOrderHistory)
}
