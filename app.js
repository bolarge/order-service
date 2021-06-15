'use strict'

const express = require('express')
const app = express()
const cors = require('cors')

const expressValidator = require('./middleware/expressValidator')

app.use(express.json({limit: '20mb'}));

app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    exposedHeaders: ['Authorization', 'Content-Type', 'X-Entity', 'X-Browser-Token']
}));

require('./routes')(app)

app.use(expressValidator)

module.exports = app