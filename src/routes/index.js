const orderController = require('../controllers/OrderController'),
  healthController = require('../controllers/HealthController'),
  wayBillController = require('../controllers/WayBillController')

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
  app.get('/v1/orders/delivery/:cardId', orderController.getCardDeliveryInformation)

  ///////////////////////////
  // WAYBILL ROUTES
  ///////////////////////////
  app.post('/v1/waybills', wayBillController.createWayBill);
  //app.post('/v1/waybills/upload', wayBillController.createWayBill)
}
