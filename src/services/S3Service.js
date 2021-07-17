const AWS = require('aws-sdk');
const s3Config = require('../config').s3Service;
const fs = require('fs').promises;

AWS.config.update({
  accessKeyId: s3Config.accessKey,
  secretAccessKey: s3Config.secret
});

const s3 = new AWS.S3({});

module.exports.uploadFile = async (fileName) => {
  return fs.readFile(fileName)
    .then (file => {
      const params = {
        Bucket: s3Config.bucketName,
        Key: fileName, // File name that appears in S3
        Body: file
      };
      s3.upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err
        console.log('File: %s, uploaded successfully, file location: %s', fileName, data.Location)
      });
    }).catch((err) => {
      console.log('Error occurred while uploading batch file', err.message);
      throw err;
    });
}
