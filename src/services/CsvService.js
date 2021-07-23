const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports.generateCustomerBatchCsv = async (fileNamePrefix, bulkRequest, dateNow) => {
  const fileName = `${fileNamePrefix}_` + dateNow;
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
