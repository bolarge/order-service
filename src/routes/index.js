const orderController = require('../controllers/OrderController'),
  healthController = require('../controllers/HealthController'),
  deliveryController = require('../controllers/DeliveryController')

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
  app.put('/v1/orders/:orderId/status', orderController.updateOrderStatus);
  app.put('/v1/orders/delivery/:cardId', deliveryController.getDeliveryAddress);

}
