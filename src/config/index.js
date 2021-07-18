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
  deliveryService: {
    baseUrl: process.env.DELIVERY_SERVICE_URL || 'http://delivery-service.staging.getcarbon.co',
    batchStatusUpdateMaxCount: process.env.BATCH_STATUS_UPDATE_MAX_CONT || 100,
    deliveryUpdateSchedule: process.env.DELIVERY_UPDATE_SCHEDULE,
  },
  paylaterService: {
    baseUrl: process.env.PAYLATER_SERVICE_URL || 'https://api.staging.paylater.ng',
    username: process.env.PAYLATER_SERVICE_USERNAME || 'test-account',
    password: process.env.PAYLATER_SERVICE_PASSWORD || 'password',
    xAppVersion: process.env.PAYLATER_X_APP_VERSION || '6.5.0'
  },
  delivery: {
    earliestTime: process.env.DELIVERY_EARLIEST_TIME || 2,
    latestTime: process.env.DELIVERY_LATEST_TIME || 4,
  },
  messagingService: {
    baseUrl: process.env.MESSAGING_SERVICE_URL || 'https://edoo7n1hs7.execute-api.us-west-2.amazonaws.com/staging',
  },
  batchConfig: {
    senderEmails: process.env.SENDER_EMAILS || 'customer@getcarbon.co',
    recipientEmails: process.env.RECIPIENT_EMAILS || ['oahwin@getcarbon.co', 'asalau@getcarbon.co'],
    emailSubject: process.env.EMAIL_SUBJECT || 'ORDER DELIVERY BATCH',
    templateName: process.env.TEMPLATE_NAME || 'batch-delivery',
  },
  s3Service: {
    bucketName: process.env.S3_BUCKET_NAME || 'card-batch-delivery',
    accessKey: process.env.S3_ACCESS_KEY,
    secret: process.env.S3_SECRET
  },
  countryConfig: {
    ng: {
      currencyCode: "NGN",
      name: "Nigeria",
      code: "NG"
    }
  }
}
