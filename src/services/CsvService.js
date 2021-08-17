const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports.generateCustomerBatchCsv = async (fileNamePrefix, bulkRequest, dateNow) => {
  const fileName = `${fileNamePrefix}_` + dateNow + `.xlsx`;
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      {id: 'customerId', title: 'ReferenceNo'},
      {id: 'customerFullName', title: 'RecipientName'},
      {id: 'deliveryAddress', title: 'RecipientAddress'},
      {id: 'customerPhoneNumber', title: 'PhoneNo'},
      {id: 'customerEmail', title: 'Email'},
      {id: 'destination', title: 'Destination'},
    ]
  });
  await csvWriter.writeRecords(bulkRequest)
  console.log('The CSV file %s was written successfully', fileName);
  return fileName;
}
