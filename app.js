'use strict'

const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const deliveryService = require('./src/services/DeliveryService');

const config = require('./src/config');

app.use(express.json({limit: '20mb'}));

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    exposedHeaders: ['Authorization', 'Content-Type', 'X-Entity', 'X-Browser-Token']
}));

require('./src/routes')(app)

app.listen(config.app.port);
// shout out to the user
console.log('Serving on port ' + config.app.port);
// expose app

// Schedule tasks to be run on the server.
cron.schedule(config.deliveryService.deliveryUpdateSchedule, function() {
  console.log('running update delivery status task');
  deliveryService.updateDeliveryStatus();
}, {});

module.exports = app
