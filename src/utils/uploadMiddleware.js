const util = require("util");
const multer = require('multer');
const csv = require('csvtojson')
const app = require("../../app");
const wayBillModel = require('../models/WayBill').Model

const dir = './src/uploads/';

// -> Multer Upload Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const uploads = multer({storage: storage});

app.post('/v1/waybills/upload', uploads.single('csv'),(req,res)=>{
  //convert csvfile to jsonArray
  csv()
    .fromFile(req.file.path)
    .then((jsonObj)=>{
      console.log(jsonObj);
      // Insert Json-Object to MongoDB
      wayBillModel.insertMany(jsonObj,(err,data)=>{
        if(err){
          console.log(err);
        }else{
          res.redirect('/');
        }
      });
    });
});

let uploadMiddleware = util.promisify(uploads.single);

module.exports = uploadMiddleware;
