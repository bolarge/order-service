const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("employees.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push({
      clientId: data[0],
      wayBillNumber: data[1],
      wayBillBatch: data[2]
    });
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    // save to the MongoDB database collection
  });

stream.pipe(csvStream);
