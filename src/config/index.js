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
    baseUrl: process.env.CARD_SERVICE_URL || 'https://cardservice-staging.getcarbon.co',
    username: process.env.CARD_SERVICE_USERNAME || 'test',
    password: process.env.CARD_SERVICE_PASSWORD || 'test',
    cardType: process.env.CARD_TYPE || 'PHYSICAL',
  },
  countryConfig: {
    ng: {
      currencyCode: "NGN",
      name: "Nigeria",
      code: "NG"
    }
  }
}
