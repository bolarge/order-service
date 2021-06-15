const orderController = require('../Controllers/OrderController');
const healthController = require('../Controllers/HealthController');

module.exports = function (app) {

    ///////////////////////////
    // HEALTH CHECK ROUTES
    ///////////////////////////
    app.get('/health', setupController.healthCheck);

    ///////////////////////////
    // ORDER ROUTES
    ///////////////////////////
    app.post('/v1/orders', orderController.createOrder);
    app.get('/v1/orders/:orderId', orderController.getOrder);

}
