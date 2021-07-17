'use strict'

const express = require('express')
const app = express()
const cors = require('cors')
const cron = require('node-cron');

const config = require('./src/config');
const orderService = require('./src/services/OrderService');

app.use(express.json({limit: '20mb'}));

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    exposedHeaders: ['Authorization', 'Content-Type', 'X-Entity', 'X-Browser-Token']
}));

require('./src/routes')(app)

cron.schedule('5 * * * * *', function() {
  orderService.getRescheduleForDeliveryOnly()
    .then((result) => {
      return console.log('Successfully re-scheduled failed delivery only orders ')
    })
    .catch((err) => {
      return console.log(err)
    });
});

app.listen(config.app.port);
// shout out to the user
console.log('Serving on port ' + config.app.port);
// expose app

module.exports = app
