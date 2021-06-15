const config = {}
const dotenv = require("dotenv");

const path = require("path");
const fs = require('fs');
const envfile = path.resolve(__dirname, `../../.env`)

if (fs.existsSync(envfile)) {
    dotenv.config()
}


let appProperties = {
    name: "Order Service",
    connectivityCheckURL: process.env.CONNECTIVITY_CHECK_URL || 'https://www.google.com/',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    logLevel: process.env.APP_LOG_LEVEL || 'debug',
}

let db = {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/orderservice',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        poolSize: parseInt(process.env.DB_CON_POOL_SIZE) || 5
    }
};