const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Utils = require('../utils')


module.exports.generateBatchCsv = async (bulkRequest) => {
  const randomString = Utils.generateRandomString(3);
  const fileName = `${randomString}_batched_csv_` + new Date().toISOString();
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      {id: 'customerId', title: 'Id'},
      {id: 'customerFullName', title: 'Name'},
      {id: 'customerGender', title: 'Gender'},
      {id: 'customerPhoneNumber', title: 'Phone number'},
      {id: 'customerEmail', title: 'Email'},
      {id: 'cardDisplayName', title: 'Card Display Name'},
      {id: 'deliveryAddress', title: 'Delivery Address'}
    ]
  });
  await csvWriter.writeRecords(bulkRequest)
  console.log('The CSV file %s was written successfully', fileName);
  return fileName;
}
