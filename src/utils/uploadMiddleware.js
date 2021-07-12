/**
 * Created by Bolaji on 08/06/2021.
 *
 */

const util = require("util");
const multer = require('multer');
//const csv = require('csvtojson')
const wayBillModel = require('../models/WayBill').Model

const dir = './src/uploads/';

// -> Multer Upload Storage
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/plain" || file.mimetype === "text/csv" || file.mimetype === "ext/csv") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('File types allowed is csv only!'));
    }
  }
}).single("csv");

let fileUploadMiddleware = util.promisify(upload);

module.exports = fileUploadMiddleware;


