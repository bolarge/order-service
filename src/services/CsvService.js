const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Utils = require('../utils')


module.exports.generateCustomerBatchCsv = async (bulkRequest) => {
  const randomString = Utils.generateRandomString();
  const fileName = `batched_csv_${randomString}_` + new Date().toISOString();
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      {id: 'customerId', title: 'Customer Id'},
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
