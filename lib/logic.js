/*For Notifications*/
// 'use strict';
// var orderStatus = {
//     RequestDiagnosis: { code: 1, text: 'Order Diagnosis' },
//     CancelDiagnosis: { code: 2, text: 'Cancel Diagnosis' },
//     Pay: { code: 3, text: 'Made Payment' },
//     OrderFromLaboratory: { code: 4, text: 'Order Submitted to Laboratory' },
//     RequestInsurance: { code: 5, text: 'Requested Insurance coverage' },
//     DeliverReports: { code: 6, text: 'Delivered reports of diagnosis' },
//     DeliverInsurance: { code: 15, text: 'Recieved payment from insurance' },
//     // Backorder: {code: 7, text: 'Order Backordered'},
//     // Dispute: {code: 8, text: 'Order Disputed'},
//     // Resolve: {code: 9, text: 'Order Dispute Resolved'},
//     // RequestPayment: {code: 10, text: 'Payment Requested'},
//     // AuthorizePayment: {code: 11, text: 'Payment Approved'},
//     // Refund: {code: 14, text: 'Payment Processed'},
//     RemoveDoctor: { code: 12, text: 'The doctor has been removed' },
//     RemovePatient: { code: 13, text: 'The patient has been removed' }
// };

/**
 * create an order to request a
 * @param {org.example.mynetwork.RegisterDiagnosis} patient_data - the order to be processed
 * @transaction
 */
function RegisterDiagnosis(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;

    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.RequestDiagnosisAI} patient_data - the order to be processed
 * @transaction
 */
function RequestDiagnosisAI(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;

    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.RequestDiagnosisDoctor} patient_data - the order to be processed
 * @transaction
 */
function RequestDiagnosisDoctor(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;
    patient_data.diagnosis.doctor = patient_data.doctor;
    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.ResultByDoctor} patient_data - the order to be processed
 * @transaction
 */
function ResultByDoctor(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;
    patient_data.diagnosis.doctor = patient_data.doctor;
    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.RequestDataLaboratory} patient_data - the order to be processed
 * @transaction
 */
function RequestDataLaboratory(patient_data) {
    patient_data.labReport.patient = patient_data.patient;
    patient_data.labReport.laboratory = patient_data.laboratory;
    return getAssetRegistry('org.example.mynetwork.LabReport')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.labReport);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.DataByLaboratory} patient_data - the order to be processed
 * @transaction
 */
function DataByLaboratory(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;
    patient_data.diagnosis.laboratory = patient_data.laboratory;
    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.SendDataInsurance} patient_data - the order to be processed
 * @transaction
 */
function SendDataInsurance(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;
    patient_data.diagnosis.insurer = patient_data.insurer;
    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
 * create an order to request a
 * @param {org.example.mynetwork.InsuranceResult} patient_data - the order to be processed
 * @transaction
 */
function InsuranceResult(patient_data) {
    patient_data.diagnosis.patient = patient_data.patient;
    patient_data.diagnosis.doctor = patient_data.doctor;
    return getAssetRegistry('org.example.mynetwork.Diagnosis')
        .then(function (assetRegistry) {
            return assetRegistry.update(patient_data.diagnosis);
        });
}

/**
  * Remove all high volume commodities
  * @param {org.example.mynetwork.RemoveDoctor} remove - the remove to be processed
  * @transaction
*/
// async function RemoveDoctor(remove) {
//     let participantRegistry = await getParticipantRegistry('org.example.mynetwork.Doctor');
//     let results = await query('selectDoctorWithWrongDiagnosis');
//     for (let n = 0; n < results.length; n++) {
//         let trade = results[n];
//         participantRegistry.remove(trade);
//     }
// }

/**
  * Add a patient
  * @param {org.example.mynetwork.AddPatient} patient_data - the add to be processed
  * @transaction
*/
function AddPatient(patient_data) {
    //let participantRegistry = getParticipantRegistry('org.example.mynetwork.Patient');
    return getParticipantRegistry('org.example.mynetwork.Patient')
        .then(function (participantRegistry) {
            return participantRegistry.update(patient_data.patient);
        });
}

/**
  * Add a doctor
  * @param {org.example.mynetwork.AddDoctor} patient_data - the add to be processed
  * @transaction
*/
function AddDoctor(patient_data) {
    //let participantRegistry = getParticipantRegistry('org.example.mynetwork.Doctor');
    return getParticipantRegistry('org.example.mynetwork.Doctor')
        .then(function (participantRegistry) {
            return participantRegistry.update(patient_data.doctor);
        });
}

/**
  * Add a Laboratory
  * @param {org.example.mynetwork.AddLaboratory} laboratory_data - the add to be processed
  * @transaction
*/
function AddLaboratory(laboratory_data) {
    //let participantRegistry = getParticipantRegistry('org.example.mynetwork.Laboratory');
    return getParticipantRegistry('org.example.mynetwork.Laboratory')
        .then(function (participantRegistry) {
            return participantRegistry.update(laboratory_data.laboratory);
        });
}

/**
  * Add a insurer
  * @param {org.example.mynetwork.AddInsurer} insurer_data - the add to be processed
  * @transaction
*/
function AddInsurer(insurer_data) {
    //let participantRegistry = getParticipantRegistry('org.example.mynetwork.Insurer');
    return getParticipantRegistry('org.example.mynetwork.Insurer')
        .then(function (participantRegistry) {
            return participantRegistry.update(insurer_data.insurer);
        });
}
// /**
//  * create an order to cancel the diagnosis
//  * @param {org.example.mynetwork.CancelDiagnosis} purchase - the order to be processed
//  * @transaction
//  */
// function CancelDiagnosis(purchase) {
//     if ((purchase.diagnosis.status == JSON.stringify(orderStatus.RequestDiagnosisDoctor)))
//     {
//     purchase.diagnosis.patient = purchase.patient;
//     purchase.diagnosis.doctor = purchase.doctor;
//     purchase.diagnosis.CancelDiagnosis = new Date().toISOString();
//     purchase.diagnosis.status = JSON.stringify(orderStatus.CancelDiagnosis);
//     return getAssetRegistry('org.example.mynetwork.Diagnosis')
//         .then(function (assetRegistry) {
//             return assetRegistry.update(purchase.diagnosis);
//         });
//     }
// }

// /**
//  * Record a request to purchase
//  * @param {org.example.mynetwork.Pay} purchase - the order to be processed
//  * @transaction
//  */
// function Pay(purchase) {
//     if (purchase.diagnosis.status == JSON.stringify(orderStatus.RequestDiagnosis) && purchase.diagnosis.status != JSON.stringify(orderStatus.CancelDiagnosis))
//     {
//         purchase.diagnosis.patient= purchase.patient;
//         purchase.diagnosis.doctor = purchase.doctor;
//         purchase.diagnosis.amount = purchase.amount;
//         purchase.diagnosis.paid = new Date().toISOString();
//         purchase.diagnosis.status = JSON.stringify(orderStatus.Pay);
//         return getAssetRegistry('org.example.mynetwork.Diagnosis')
//         .then(function (assetRegistry) {
//             return assetRegistry.update(purchase.diagnosis);
//         });
//     }
// }
// /**
//  * create an order to cancel the diagnosis
//  * @param {org.example.mynetwork.OrderFromLaboratory} purchase - the order to be processed
//  * @transaction
//  */
// function OrderFromLaboratory(purchase) {
//     purchase.diagnosis.patient = purchase.patient;
//     purchase.diagnosis.laboratory = purchase.laboratory;
//     purchase.diagnosis.OrderFromLaboratory = new Date().toISOString();
//     purchase.diagnosis.status = JSON.stringify(orderStatus.OrderFromLaboratory);
//     return getAssetRegistry('org.example.mynetwork.Diagnosis')
//         .then(function (assetRegistry) {
//             return assetRegistry.update(purchase.diagnosis);
//         });
// }

// /**
//  * create an order to cancel the diagnosis
//  * @param {org.example.mynetwork.RequestInsurance} purchase - the order to be processed
//  * @transaction
//  */
// function RequestInsurance(purchase) {
//     purchase.diagnosis.patient = purchase.patient;
//     purchase.diagnosis.insurance = purchase.insurance;
//     purchase.diagnosis.doctor = purchase.doctor;
//     purchase.diagnosis.RequestInsurance = new Date().toISOString();
//     purchase.diagnosis.status = JSON.stringify(orderStatus.RequestInsurance);
//     return getAssetRegistry('org.example.mynetwork.Diagnosis')
//         .then(function (assetRegistry) {
//             return assetRegistry.update(purchase.diagnosis);
//         });
// }

// /**
//  * create an order to cancel the diagnosis
//  * @param {org.example.mynetwork.DeliverReports} purchase - the order to be processed
//  * @transaction
//  */
// function DeliverReports(purchase) {
//     purchase.diagnosis.patient = purchase.patient;
//     purchase.diagnosis.doctor = purchase.doctor;
//     purchase.diagnosis.DeliverReports = new Date().toISOString();
//     purchase.diagnosis.status = JSON.stringify(orderStatus.DeliverReports);
//     return getAssetRegistry('org.example.mynetwork.Diagnosis')
//         .then(function (assetRegistry) {
//             return assetRegistry.update(purchase.diagnosis);
//         });
// }
