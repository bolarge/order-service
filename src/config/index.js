const dotenv = require("dotenv");

const path = require("path");
const fs = require('fs');
const envfile = path.resolve(__dirname, `../../.env`)

if (fs.existsSync(envfile)) {
  dotenv.config()
}

module.exports = {
  app: {
    name: "Order Service",
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    logLevel: process.env.APP_LOG_LEVEL || 'debug',
  },
  db: {
    app: {
      url: process.env.MONGODB_URL || 'mongodb://localhost:27017/orderservice',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        poolSize: parseInt(process.env.DB_CON_POOL_SIZE) || 5
      }
    }
  },
  cardService: {
    baseUrl: process.env.CARD_SERVICE_URL || 'hhttps://cardservice-staging.getcarbon.co',
    username: process.env.CARD_SERVICE_USERNAME || 'user',
    password: process.env.CARD_SERVICE_PASSWORD || 'pass',
    cardType: process.env.CARD_TYPE || 'PHYSICAL',
  },
  deliveryService: {
    baseUrl: process.env.DELIVERY_SERVICE_URL || 'http://delivery-service.staging.getcarbon.co',
  },
  paylaterService: {
    baseUrl: process.env.PAYLATER_SERVICE_URL || 'http://api.staging.paylater.ng',
    username: process.env.CARD_SERVICE_USERNAME || 'user',
    password: process.env.CARD_SERVICE_PASSWORD || 'pass',
    xAppVersion: '6.5.0'
  },
  countryConfig: {
    ng: {
      currencyCode: "NGN",
      name: "Nigeria",
      code: "NG"
    }
  }
}
