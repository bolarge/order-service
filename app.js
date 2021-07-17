'use strict'

const express = require('express');
const app = express();
const cors = require('cors');
const cronJobs = require('./src/crons/cronJobs');

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

cronJobs.startJobs();

module.exports = app
