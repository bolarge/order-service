/**
 * Created by Bolaji on 08/06/2021.
 *
 */

const wayBillModel = require('../models/WayBill').Model

module.exports.createWayBill = async (body) => {
  const wayBill = await wayBillModel.findOne({clientId: body.clientId})
  const clientId = body.clientId;
  if (wayBill) {
    console.error(`Existing waybill exists for clientId, {id}`, clientId);
    throw new Error('Existing wayBill is found')
  }
  const newWayBill = {
    clientId: body.clientId,
    wayBillNumber: body.wayBillNumber,
    wayBillBatch: body.wayBillBatch
  }

  if (body.wayBillNumber !== null) {
    return wayBillModel.create({
      ...newWayBill
    });
  }
}


