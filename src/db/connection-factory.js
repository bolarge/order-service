const mongoose = require('mongoose');
const dbConfig = require('../config');

mongoose.Promise = require('bluebird');

module.exports.create = function (name, config) {
  if (!config && !dbConfig[name]) {
    throw new Error(`Database <${name}> connection configuration is missing`);
  }

  config = config || dbConfig[name];
  let connection = mongoose.createConnection(config.url, config.options || {});

  if (process.env.NODE_ENV !== 'test') {
    let hasConnected = false, isOnline = false;

    connection.on('error', function (err) {
      console.error('Connection could not be established, error: ', err);
      if (!hasConnected) {
        console.error('Could not connect to DB, exiting.');
        process.exit(1);
      }
    });

    connection.on('connecting', function () {
      console.log(`DB <${name}> attempting to connect...`);
    });

    connection.on('reconnected', function () {
      isOnline = true;
      console.log(`DB <${name}> connection has been re-established.`);
    });

    connection.on('disconnected', function () {
      isOnline = false;
      console.error(`DB <${name}> connection was lost.`);
    });

    connection.on('open', function () {
      console.log(`DB <${name}> connection has been established.`);
      isOnline = hasConnected = true;
    });

    connection.isOnline = function () {
      return isOnline;
    };
  }
  return connection;
};
