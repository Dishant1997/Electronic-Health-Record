'use strict';
/**
 * Write the unit tests for your transction processor functions here
 */

var sleep = require('sleep');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:27017';
// var crypto = require('crypto');
var hash = require('object-hash');
var spawn = require('child_process').spawn;
var dataString='';
var value=1;

const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');
const path = require('path');
const readline = require('readline');

const chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));

const network = 'dishant8';
const _timeout = 90000;

const namespace = 'org.example.mynetwork';
const assetType = 'Diagnosis';
const assetNS = namespace + '.' + assetType;
const participantType = 'Patient';
const participantNS = namespace + '.' + participantType;
const participantType1 = 'Doctor';
const participantNS1 = namespace + '.' + participantType1;
var diagnosisNo='11111111111111111111111111111111111111111111111';
var patientNo='11111111111111111111111111111111111111111111111';
var doctorNo='11111111111111111111111111111111111111111111111';
var hash_record='';
var patient_id;
var doctor_id;
var laboratory_id;
var insurer_id;
var diagnosis_id;
var labReport_id;
let businessNetworkConnection;

var rl;

/**
 * create an empty order
 * @param {createDiagnosisTemplate} _inbound - Order created with factory.newResource(NS, 'Order', orderNo)
 * @returns {Diagnosis} - updated order item with all required fields except for relationships (buyer, seller)
 * @utility
 */



function createDiagnosisTemplate (_inbound)
{
    _inbound.diagnosisNumber = '';
    return(_inbound);
}


async function callPython()
{
    console.log('Printing here'); 



    var py =  spawn('python', ['../Downloads/Indian_Liver_Problem/liver_prediction_mongodb.py']);
    await py.stdin.write(JSON.stringify(diagnosisNo));
    
    console.log(diagnosisNo);
    py.stdin.end();

     py.stdout.on('data',function(data) {
       console.log('called');  
      dataString += data.toString();
      console.log(dataString);
    });

     py.stdout.on('end', function(){
      console.log('Output:',dataString);
    });

}


async function fetchData()
{
    let client;
    console.log('Inside fetchdata -> diangnosisNo: ' + diagnosisNo);    
    try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    var db = client.db('testdb');
    var record = await db.collection('diagnosis').findOne({diagnosis_id: diagnosisNo});

    console.log('Fetched record: ' + record);
    console.log('FETCH SUCCESS');

    } catch (err) {
        console.log(err.stack);
    }
    if (client) {
        client.close();
    } 

    await callPython();
    console.log('END of FetchData() ' + dataString);
}

async function AddPatient() {
    
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            

    //const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
    //doctor.unsucessfulDiagnosis=5;
    // create the RegisterDiagnosis transaction
    

    let client;
    
    var patient_name;
    var patient_age;
    var patient_gender;
    var patient_email;
    var patient_mobile;
    var patient_blood_group;
    var patient_address;

    // var rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout
    // })


    const question1 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Name? ', (answer) => {
              patient_name = answer;
            console.log(`Thank you for your valuable feedback: ${patient_name}`)
            resolve()
          })
        })
      }
      
      const question2 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Age? ', (answer) => {
            patient_age = answer;
            console.log(`Thank you for your valuable feedback: ${patient_age}`)
            resolve()
          })
        })
      }

      const question3 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Gender? ', (answer) => {
            patient_gender = answer;
            console.log(`Thank you for your valuable feedback: ${patient_gender}`)
            resolve()
          })
        })
      }
      
      const question4 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Email Id? ', (answer) => {
            patient_email = answer;
            console.log(`Thank you for your valuable feedback: ${patient_email}`)
            resolve()
          })
        })
      }

      const question5 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Contact No.?  ', (answer) => {
            patient_mobile = answer;
            console.log(`Thank you for your valuable feedback: ${patient_mobile}`)
            resolve()
          })
        })
      }

      const question6 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Blood Group? ', (answer) => {
            patient_blood_group =answer;
            console.log(`Thank you for your valuable feedback: ${patient_blood_group}`)
            resolve()
          })
        })
      }
      
      const question7 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Address? ', (answer) => {
            patient_address = answer;
            console.log(`Thank you for your valuable feedback: ${patient_address}`)
            resolve()
          })
        })
      }

        await question1();
        await question2();

        await question3();
        await question4();

        await question5();
        await question6();

        await question7();
        // await question2()
        console.log('before ' + patient_blood_group);
        // rl.close();

        console.log('after ' + patient_blood_group);
        // sleep.sleep(10);

    

    try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    var record = { patient_name: patient_name, patient_age: patient_age, patient_gender: patient_gender, patient_email: patient_email, patient_mobile: patient_mobile, 
        patient_blood_group: patient_blood_group, patient_address: patient_address };

    console.log(record);    
    var hash_record = hash(record);

    console.log("This is the hash: " + hash_record);

    var record_to_be_inserted = { patient_id: hash_record,  patient_name: patient_name, patient_age: patient_age, patient_gender: patient_gender, patient_email: patient_email, patient_mobile: patient_mobile, 
        patient_blood_group: patient_blood_group, patient_address: patient_address };

    patient_id = hash_record;
    patientNo = patient_id;




    db.collection('patient').insertOne(record_to_be_inserted, function (err, result) {
        if (err) throw err;
        console.log("1 Record Inserted");
    });

    } catch (err) {
    console.log(err.stack);
    }

    if (client) {
        console.log('closing client');
        client.close();
    }   

    console.log('Data Inserted');

    console.log('here0' + patientNo);
    //create an empty diagnosis template

    //create a patient
    const patient = factory.newResource(namespace, 'Patient', patient_id);

    var createNewPatient = factory.newTransaction(namespace, 'AddPatient');

    createNewPatient.patient = factory.newRelationship(namespace, 'Patient', patient.$identifier);
    
    //createnew
    console.log('here'); 
    

            // Get the asset registry.
        return businessNetworkConnection.getParticipantRegistry(namespace + '.Patient')
        .then((participantRegistry) => {
                return participantRegistry.add(patient)
                .then(() => {
                    // submit the transaction
                    console.log('here02');
                    return businessNetworkConnection.submitTransaction(createNewPatient);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
                })
                .then((participantRegistry) => {
                    // re-get the commodity
                    console.log('here04');
                    return participantRegistry.get(patient.$identifier);
                })
                .then((newPatient) => {
                    // the owner of the commodity should not be simon
                    console.log('here05');
                    newPatient.$identifier.should.equal(patient_id);
                });
        });

}

async function AddDoctor()
{
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          

    //const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
    //doctor.unsucessfulDiagnosis=5;
    // create the RegisterDiagnosis transaction
    

    let client;
    
    var doctor_name;
    var doctor_age;
    var doctor_gender;
    var doctor_email;
    var doctor_mobile;
    var doctor_qualification;
    var doctor_address;

    // var rl = readline.createInterface({
    // input: process.stdin,
    // output: process.stdout
    // })


    const question1 = () => {
        return new Promise((resolve, reject) => {
        rl.question('Doctor Name? ', (answer) => {
            doctor_name = answer;
            console.log(`Thank you for your valuable feedback: ${doctor_name}`)
            resolve()
        })
        })
    }
    
    const question2 = () => {
        return new Promise((resolve, reject) => {
        rl.question('Doctor Age? ', (answer) => {
            doctor_age = answer;
            console.log(`Thank you for your valuable feedback: ${doctor_age}`)
            resolve()
        })
        })
    }

    const question3 = () => {
        return new Promise((resolve, reject) => {
        rl.question('doctor Gender? ', (answer) => {
            doctor_gender = answer;
            console.log(`Thank you for your valuable feedback: ${doctor_gender}`)
            resolve()
        })
        })
    }
    
    const question4 = () => {
        return new Promise((resolve, reject) => {
        rl.question('doctor Email Id? ', (answer) => {
            doctor_email = answer;
            console.log(`Thank you for your valuable feedback: ${doctor_email}`)
            resolve()
        })
        })
    }

    const question5 = () => {
        return new Promise((resolve, reject) => {
        rl.question('doctor Contact No.?  ', (answer) => {
            doctor_mobile = answer;
            console.log(`Thank you for your valuable feedback: ${doctor_mobile}`)
            resolve()
        })
        })
    }

    const question6 = () => {
        return new Promise((resolve, reject) => {
        rl.question('doctor Qualification? ', (answer) => {
            doctor_qualification =answer;
            console.log(`Thank you for your valuable feedback: ${doctor_qualification}`)
            resolve()
        })
        })
    }
    
    const question7 = () => {
        return new Promise((resolve, reject) => {
        rl.question('doctor Address? ', (answer) => {
            doctor_address = answer;
            console.log(`Thank you for your valuable feedback: ${doctor_address}`)
            resolve()
        })
        })
    }

        await question1();
        await question2();

        await question3();
        await question4();

        await question5();
        await question6();

        await question7();
        // await question2()
    


        // rl.close();

        // sleep.sleep(10);

    

    try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    var record = { doctor_name: doctor_name, doctor_age: doctor_age, doctor_gender: doctor_gender, doctor_email: doctor_email, doctor_mobile: doctor_mobile, 
        doctor_qualification: doctor_qualification, doctor_address: doctor_address };

    console.log(record);    
    var hash_record = hash(record);

    console.log("This is the hash: " + hash_record);

    var record_to_be_inserted = { doctor_id: hash_record,  doctor_name: doctor_name, doctor_age: doctor_age, doctor_gender: doctor_gender, doctor_email: doctor_email, doctor_mobile: doctor_mobile, 
        doctor_qualification: doctor_qualification, doctor_address: doctor_address };

    doctor_id = hash_record;
    doctorNo = doctor_id;




    db.collection('doctor').insertOne(record_to_be_inserted, function (err, result) {
        if (err) throw err;
        console.log("1 doc Inserted");
    });

    } catch (err) {
    console.log(err.stack);
    }

    if (client) {
        console.log('closing client');
        client.close();
    }   

    console.log('Data Inserted');

    console.log('here0' + doctorNo);
    //create an empty diagnosis template

    //create a doctor
    const doctor = factory.newResource(namespace, 'Doctor', doctor_id);

    var createNewDoctor = factory.newTransaction(namespace, 'AddDoctor');

    createNewDoctor.doctor = factory.newRelationship(namespace, 'Doctor', doctor_id);
    
    //createnew
    console.log('here'); 
    

            // Get the asset registry.
        return businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor')
        .then((participantRegistry) => {
                return participantRegistry.add(doctor)
                .then(() => {
                    // submit the transaction
                    console.log('here02');
                    return businessNetworkConnection.submitTransaction(createNewDoctor);
                })
                .then(() => {
                    console.log('here03');
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Doctor');
                })
                .then((participantRegistry) => {
                    // re-get the commodity
                    console.log('here04');
                    return participantRegistry.get(doctor.$identifier);
                })
                .then((newDoctor) => {
                    // the owner of the commodity should not be simon
                    console.log('here05');
                    newDoctor.$identifier.should.equal(doctor_id);
                });
        });
}

async function AddLaboratory()
{
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        

    //const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
    //doctor.unsucessfulDiagnosis=5;
    // create the RegisterDiagnosis transaction
    

    let client;
    
    var laboratory_name;
    var laboratory_email;
    var laboratory_mobile;
    var laboratory_address;

    // var rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout
    // })


    const question1 = () => {
        return new Promise((resolve, reject) => {
          rl.question('laboratory Name? ', (answer) => {
              laboratory_name = answer;
            console.log(`Thank you for your valuable feedback: ${laboratory_name}`)
            resolve()
          })
        })
      }
      
      const question2 = () => {
        return new Promise((resolve, reject) => {
          rl.question('laboratory Mobile No? ', (answer) => {
            laboratory_mobile = answer;
            console.log(`Thank you for your valuable feedback: ${laboratory_mobile}`)
            resolve()
          })
        })
      }

      const question3 = () => {
        return new Promise((resolve, reject) => {
          rl.question('laboratory Address? ', (answer) => {
            laboratory_address = answer;
            console.log(`Thank you for your valuable feedback: ${laboratory_address}`)
            resolve()
          })
        })
      }
      
      const question4 = () => {
        return new Promise((resolve, reject) => {
          rl.question('laboratory Email Id? ', (answer) => {
            laboratory_email = answer;
            console.log(`Thank you for your valuable feedback: ${laboratory_email}`)
            resolve()
          })
        })
      }

      

        await question1();
        await question2();

        await question3();
        await question4();


        // rl.close();

        // sleep.sleep(10);

    

    try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    var record = { laboratory_name: laboratory_name, laboratory_email: laboratory_email, laboratory_mobile: laboratory_mobile, 
        laboratory_address: laboratory_address };

    console.log(record);    
    var hash_record = hash(record);

    console.log("This is the hash: " + hash_record);

    var record_to_be_inserted = { laboratory_id: hash_record,  laboratory_name: laboratory_name, laboratory_email: laboratory_email, laboratory_mobile: laboratory_mobile, 
        laboratory_address: laboratory_address };

    laboratory_id = hash_record;
    // laboratoryNo = laboratory_id;




    db.collection('laboratory').insertOne(record_to_be_inserted, function (err, result) {
        if (err) throw err;
        console.log("1 Record Inserted");
    });

    } catch (err) {
    console.log(err.stack);
    }

    if (client) {
        console.log('closing client');
        client.close();
    }   

    console.log('Data Inserted');

    // console.log('here0' + laboratoryNo);
    //create an empty diagnosis template

    //create a laboratory
    const laboratory = factory.newResource(namespace, 'Laboratory', laboratory_id);

    var createNewLaboratory = factory.newTransaction(namespace, 'AddLaboratory');

    createNewLaboratory.laboratory = factory.newRelationship(namespace, 'Laboratory', laboratory.$identifier);
    
    //createnew
    console.log('here'); 
    

            // Get the asset registry.
        return businessNetworkConnection.getParticipantRegistry(namespace + '.Laboratory')
        .then((participantRegistry) => {
                return participantRegistry.add(laboratory)
                .then(() => {
                    // submit the transaction
                    console.log('here02');
                    return businessNetworkConnection.submitTransaction(createNewLaboratory);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Laboratory');
                })
                .then((participantRegistry) => {
                    // re-get the commodity
                    console.log('here04');
                    return participantRegistry.get(laboratory.$identifier);
                })
                .then((newLaboratory) => {
                    // the owner of the commodity should not be simon
                    console.log('here05');
                    newLaboratory.$identifier.should.equal(laboratory_id);
                });
        });
}

async function AddInsurer()
{
    const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        

    //const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
    //doctor.unsucessfulDiagnosis=5;
    // create the RegisterDiagnosis transaction
    

    let client;
    
    var insurer_name;
    var insurer_email;
    var insurer_mobile;
    var insurer_address;

    // var rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout
    // })


    const question1 = () => {
        return new Promise((resolve, reject) => {
          rl.question('insurer Name? ', (answer) => {
              insurer_name = answer;
            console.log(`Thank you for your valuable feedback: ${insurer_name}`)
            resolve()
          })
        })
      }
      
      const question2 = () => {
        return new Promise((resolve, reject) => {
          rl.question('insurer Mobile No? ', (answer) => {
            insurer_mobile = answer;
            console.log(`Thank you for your valuable feedback: ${insurer_mobile}`)
            resolve()
          })
        })
      }

      const question3 = () => {
        return new Promise((resolve, reject) => {
          rl.question('insurer Address? ', (answer) => {
            insurer_address = answer;
            console.log(`Thank you for your valuable feedback: ${insurer_address}`)
            resolve()
          })
        })
      }
      
      const question4 = () => {
        return new Promise((resolve, reject) => {
          rl.question('insurer Email Id? ', (answer) => {
            insurer_email = answer;
            console.log(`Thank you for your valuable feedback: ${insurer_email}`)
            resolve()
          })
        })
      }

      

        await question1();
        await question2();

        await question3();
        await question4();


        // rl.close();

        // sleep.sleep(10);

    

    try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    var record = { insurer_name: insurer_name, insurer_email: insurer_email, insurer_mobile: insurer_mobile, 
        insurer_address: insurer_address };

    console.log(record);    
    var hash_record = hash(record);

    console.log("This is the hash: " + hash_record);

    var record_to_be_inserted = { insurer_id: hash_record,  insurer_name: insurer_name, insurer_email: insurer_email, insurer_mobile: insurer_mobile, 
        insurer_address: insurer_address };

    insurer_id = hash_record;
    // insurerNo = insurer_id;




    db.collection('insurer').insertOne(record_to_be_inserted, function (err, result) {
        if (err) throw err;
        console.log("1 Record Inserted");
    });

    } catch (err) {
    console.log(err.stack);
    }

    if (client) {
        console.log('closing client');
        client.close();
    }   

    console.log('Data Inserted');

    // console.log('here0' + insurerNo);
    //create an empty diagnosis template

    //create a insurer
    const insurer = factory.newResource(namespace, 'Insurer', insurer_id);

    var createNewInsurer = factory.newTransaction(namespace, 'AddInsurer');

    createNewInsurer.insurer = factory.newRelationship(namespace, 'Insurer', insurer.$identifier);
    
    //createnew
    console.log('here'); 
    

            // Get the asset registry.
        return businessNetworkConnection.getParticipantRegistry(namespace + '.Insurer')
        .then((participantRegistry) => {
                return participantRegistry.add(insurer)
                .then(() => {
                    // submit the transaction
                    console.log('here02');
                    return businessNetworkConnection.submitTransaction(createNewInsurer);
                })
                .then(() => {
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Insurer');
                })
                .then((participantRegistry) => {
                    // re-get the commodity
                    console.log('here04');
                    return participantRegistry.get(insurer.$identifier);
                })
                .then((newInsurer) => {
                    // the owner of the commodity should not be simon
                    console.log('here05');
                    newInsurer.$identifier.should.equal(insurer_id);
                });
        });
}

async function validatePatient(temp_patient_hash)
{
  return businessNetworkConnection.getParticipantRegistry(namespace + '.Patient')
      .then((participantRegistry) => {

          // add the order to the asset registry.
          return participantRegistry.exists(temp_patient_hash);
      })
      .then((exists) => {
          return exists;
      })
      .catch((error) => {
          console.log('Error!! ' + error);
      });
  
}
  
  

    
//     bool=db.collection('patient').find({patient_id:temp_patient_hash}).count();

//     console.log(bool);

//     } catch (err) {
//     console.log(err.stack);
//     }
  
//     if (client) {
//         console.log('closing client');
//         client.close();
//     }	

//     return bool;


async function RegisterDiagnosis()
{
  const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
  // //create a patient
  // const patient = factory.newResource(namespace, 'Patient', patient_id);

  // const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
  // doctor.unsucessfulDiagnosis=5;
  // create the RegisterDiagnosis transaction
  const createNew = factory.newTransaction(namespace, 'RegisterDiagnosis');

  let client;
  var bool;

  var age;
  var gender;

  var temp_patient_hash;
  var temp_patient;

  var total_bilirubin;
  var direct_bilirubin;
  var alkaline_phosphotase;
  var alamine_amino_transferase;
  var asparate_amino_transferase;
  var total_protiens;
  var albumin;
  var albumin_and_globulin_ratio;

  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Patient Id? ', (answer) => {
          temp_patient_hash = answer;
        console.log(`Thank you for your valuable feedback: ${temp_patient_hash}`)
        resolve()
      })
    })
  }

  await question1();

  bool = await validatePatient(temp_patient_hash);
  // console.log('Hii '+ bool);
  if(bool===false)
  {
    console.log('Patient with given Patient ID is not registered!! Please Register!');
    return;
  }
  
  const question2 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Total Bilirubin? ', (answer) => {
        total_bilirubin = answer;
        console.log(`Thank you for your valuable feedback: ${total_bilirubin}`)
        resolve()
      })
    })
  }

  const question3 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Direct Bilirubin? ', (answer) => {
        direct_bilirubin = answer;
        console.log(`Thank you for your valuable feedback: ${direct_bilirubin}`)
        resolve()
      })
    })
  }
  
  const question4 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Alkaline Phosphate? ', (answer) => {
        alkaline_phosphotase = answer;
        console.log(`Thank you for your valuable feedback: ${alkaline_phosphotase}`)
        resolve()
      })
    })
  }

  const question5 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Alamine Amino Transferase?  ', (answer) => {
        alamine_amino_transferase = answer;
        console.log(`Thank you for your valuable feedback: ${alamine_amino_transferase}`)
        resolve()
      })
    })
  }

  const question6 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Asparate Amino Transferase? ', (answer) => {
        asparate_amino_transferase =answer;
        console.log(`Thank you for your valuable feedback: ${asparate_amino_transferase}`)
        resolve()
      })
    })
  }
  
  const question7 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Total Proteins? ', (answer) => {
        total_protiens = answer;
        console.log(`Thank you for your valuable feedback: ${total_protiens}`)
        resolve()
      })
    })
  }

  const question8 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Albumin? ', (answer) => {
        albumin = answer;
        console.log(`Thank you for your valuable feedback: ${albumin}`)
        resolve()
      })
    })
  }

  const question9 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Albumin and Globulin ratio? ', (answer) => {
        albumin_and_globulin_ratio = answer;
        console.log(`Thank you for your valuable feedback: ${albumin_and_globulin_ratio}`)
        resolve()
      })
    })
  }

    
    await question2();

    await question3();
    await question4();

    await question5();
    await question6();

    await question7();
    await question8();
    await question9();


  
  try {
  // Use connect method to connect to the Server
  client = await MongoClient.connect(url,{ useNewUrlParser: true });
  var age,gender;
  var db = client.db('testdb');

    console.log('patient id here: ' +  temp_patient_hash);

  var cursor = await db.collection('patient').findOne( {patient_id:temp_patient_hash},{_id:0,patient_age:1,patient_gender:1} );
  console.log('Cursor: '+cursor);
  // cursor.forEach((doc) => {
  //   console.log('inside for each');
  //   age = doc.patient_age;
  //   gender = doc.patient_gender; 
  // });
  
  console.log('Age : ' + cursor.patient_age + ' Gender: ' + cursor.patient_gender);
  // cursor.patient_age

  var record = { patient_id: temp_patient_hash, age: cursor.patient_age, gender: cursor.patient_gender, total_bilirubin: total_bilirubin, direct_bilirubin: direct_bilirubin, 
              alkaline_phosphotase: alkaline_phosphotase, alamine_amino_transferase: alamine_amino_transferase, asparate_amino_transferase: asparate_amino_transferase,
              total_protiens: total_protiens, albumin: albumin, albumin_and_globulin_ratio: albumin_and_globulin_ratio };

  console.log(record);	
  var hash_record = hash(record);

  console.log("This is the hash: " + hash_record);

  var record_to_be_inserted = { diagnosis_id: hash_record, patient_id: temp_patient_hash, age: cursor.patient_age, gender:cursor.patient_gender, total_bilirubin: total_bilirubin, direct_bilirubin: direct_bilirubin, 
          alkaline_phosphotase: alkaline_phosphotase, alamine_amino_transferase: alamine_amino_transferase, asparate_amino_transferase: asparate_amino_transferase,
          total_protiens: total_protiens, albumin: albumin, albumin_and_globulin_ratio: albumin_and_globulin_ratio };

  diagnosis_id = hash_record;
  diagnosisNo = diagnosis_id;
  //db.collection('diagnosis').deleteMany({diagnosis_id: 1001});
  await db.collection('diagnosis').insertOne(record_to_be_inserted, function (err, result) {
      if (err) throw err;
      console.log("1 Diagnosis Inserted");
  });

  } catch (err) {
  console.log(err.stack);
  }

  if (client) {
      console.log('closing client');
      client.close();
  }	

  console.log('Data Inserted');

  console.log('here0' + diagnosisNo);
  //create an empty diagnosis template

  var diagnosis = factory.newResource(namespace, 'Diagnosis', diagnosis_id);
  console.log('here1');
  diagnosis = createDiagnosisTemplate(diagnosis);
  console.log('here2');
  diagnosis.diagnosisNumber=diagnosisNo;
  console.log('here3');


  // const doctor = factory.newResource(namespace, 'Doctor', 'null');
  // const laboratory = factory.newResource(namespace, 'Laboratory', 'null');
  // const insurer = factory.newResource(namespace, 'Insurer', 'null');
  

  createNew.diagnosis = factory.newRelationship(namespace, 'Diagnosis', diagnosis.$identifier);
  createNew.patient = factory.newRelationship(namespace, 'Patient', temp_patient_hash);
  
  diagnosis.patient=factory.newRelationship(namespace, 'Patient', temp_patient_hash);
  diagnosis.laboratory = factory.newRelationship(namespace,'Laboratory','null')
  diagnosis.doctor=factory.newRelationship(namespace, 'Doctor', 'null');
  diagnosis.insurer=factory.newRelationship(namespace,'Insurer','null');

  createNew.diagnosis.$identifier.should.equal(diagnosisNo);

  console.log('here'); 
  

          // Get the asset registry.
      return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
      .then((assetRegistry) => {

          // add the order to the asset registry.
          return assetRegistry.add(diagnosis)
              .then(() => {
                  console.log('here00');
                  return businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
              })
              .then(() => {
                  // submit the transaction
                  console.log('here02');
                  return businessNetworkConnection.submitTransaction(createNew);
              })
              .then(() => {
                  console.log('here03');
                  return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis');
              })
              .then((assetRegistry) => {
                  // re-get the commodity
                  console.log('here04');
                  return assetRegistry.get(diagnosis.$identifier);
              })
              .then((newDiagnosis) => {
                  // the owner of the commodity should not be simon
                  console.log('here05');
                  newDiagnosis.patient.$identifier.should.equal(temp_patient_hash);
              });
          }); 
          
}

async function validateDiagnosis(temp_patient_hash)
{
  diagnosisNo = 404;

  return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
  .then((assetRegistry) => {
      // re-get the commodity
      return assetRegistry.getAll();
  })
  .then((newDiagnosis) => {

      // console.log(newDiagnosis);
      // let index='-1';
      for(let i=0; i<newDiagnosis.length; i++)
      {
        if(newDiagnosis[i].patient.$identifier===temp_patient_hash)
        {
          diagnosisNo = newDiagnosis[i].$identifier;
          console.log('Diagnosis id: '+diagnosisNo + ' \nPatient id: '+ newDiagnosis[i].patient.$identifier);
          //index=i;
          break;
        }

      }
      return diagnosisNo;
  })
}

async function RequestDiagnosisAI()
{
  const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          
  // create the RequestDiagnosisAI transaction
  const results = factory.newTransaction(namespace, 'RequestDiagnosisAI');
  var temp_patient_hash;
  
  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Patient Id? ', (answer) => {
          temp_patient_hash = answer;
        console.log(`Thank you for your valuable feedback: ${temp_patient_hash}`)
        resolve()
      })
    })
  }

  
  await question1();

  console.log('Data Inserted');

  
  //create an empty diagnosis template
  
  diagnosisNo = await validateDiagnosis(temp_patient_hash);

  console.log('here0' + diagnosisNo);

      if(diagnosisNo === 404)
      {
        console.log('Patient with given Diagnosis id is not Registered!!!');
        return;
      }
      console.log('printing before fetch data');

      // newDiagnosis.patient.$identifier.should.equal(patient_id);
      // newDiagnosis.$identifier.should.equal(diagnosisNo);

      await fetchData();

      return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
      .then((assetRegistry) => {
          // re-get the commodity
          return assetRegistry.get(diagnosisNo);
      })
      .then((newDiagnosis) => {
          results.diagnosis = factory.newRelationship(namespace, 'Diagnosis', newDiagnosis.$identifier);
          results.patient = factory.newRelationship(namespace, 'Patient', newDiagnosis.patient.$identifier);
          //results.doctor = newDiagnosis.doctor;
          // results.diagnosis.$identifier=diagnosisNo;
          // results.patient.$identifier=temp_patient_hash;
          // submit the transaction
          return businessNetworkConnection.submitTransaction(results)
          .then(() => {
              return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis');
          })
          .then((assetRegistry) => {
              // re-get the commodity
              return assetRegistry.get(diagnosisNo);
          })
          .then((newDiagnosis_new) => {
              // the owner of the commodity should be patient
              newDiagnosis_new.patient.$identifier.should.equal(temp_patient_hash);
              // JSON.parse(newDiagnosis.status).text.should.equal(orderStatus.Bought.text);
          });

  });
}

async function displayDoctors(result)
{

  for(let i=0;i<result.length;i++)
  {
      console.log((i+1) + '.  Doctor Name: ' + result[i].doctor_name);
      console.log('    Doctor Qualification: ' + result[i].doctor_qualification);
      console.log('    Doctor Address: ' + result[i].doctor_address);

  }
  
}

async function RequestDiagnosisDoctor()
{
  var temp_patient_hash;
  var doctor_name;
  var bool;

  const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          
  // create the RequestDiagnosisAI transaction
  const results = factory.newTransaction(namespace, 'RequestDiagnosisDoctor');

  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Patient Id? ', (answer) => {
        temp_patient_hash = answer;
        console.log(`Thank you for your valuable feedback: ${temp_patient_hash}`)
        resolve()
      })
    })
  }

  await question1();

  bool = await validatePatient(temp_patient_hash);
  // console.log('Hii '+ bool);
  if(bool === false)
  {
    console.log('Patient with given Patient ID is not registered!! Please Register!');
    return;
  } 

  const question2 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Doctor Name ', (answer) => {
        doctor_name = answer;
        console.log(`Thank you for your valuable feedback: ${doctor_name}`)
        resolve()
      })
    })
  }

  await question2();

  try {
    // Use connect method to connect to the Server
    let client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    var choice,result;
    result = await db.collection('doctor').find({doctor_name: doctor_name}).toArray();

    if(result.length === 0)
    {
      console.log('Doctor with given name not found !!!');
      return;
    }
     
    await displayDoctors(result);

    // console.log('Finding Doctor ....');
    // await sleep.sleep(3);
        
    const question3 = () => {
      return new Promise((resolve, reject) => {
        rl.question('Enter Your Doctor Choice? ', (answer) => {
          choice = answer;
          console.log(`Your choice: ${choice}`)
          resolve()
        })
      })
    }

        await question3();
        console.log('before');

        doctor_id = result[choice-1].doctor_id;
      
        console.log('after ' + doctor_id);
         
      
    } catch (err) {
      console.log(err.stack);
    }

    // if (client) {
    //     console.log('closing client');
    //     client.close();
    //   }   

    diagnosisNo = await validateDiagnosis(temp_patient_hash);
  
    console.log('here0' + diagnosisNo);

      if(diagnosisNo === 404)
      {
        console.log('Patient with given Diagnosis id is not Registered!!!');
        return;
      }
      console.log('printing before fetch data');

    return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
    .then((assetRegistry) => {
        // re-get the commodity
        return assetRegistry.get(diagnosisNo);
    })
    .then((newDiagnosis) => {
        results.diagnosis = factory.newRelationship(namespace, 'Diagnosis', newDiagnosis.$identifier);
        results.patient = factory.newRelationship(namespace, 'Patient', newDiagnosis.patient.$identifier);
        results.doctor = factory.newRelationship(namespace, 'Doctor', doctor_id);
      
        newDiagnosis.doctor = factory.newRelationship(namespace, 'Doctor', doctor_id);

        return businessNetworkConnection.submitTransaction(results)
        .then(() => {
            return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis');
        })
        .then((assetRegistry) => {
            // re-get the commodity
            return assetRegistry.get(diagnosisNo);
        })
        .then((newDiagnosis_new) => {
            // the owner of the commodity should be patient
            newDiagnosis_new.patient.$identifier.should.equal(temp_patient_hash);
            newDiagnosis_new.doctor.$identifier.should.equal(doctor_id);
            // JSON.parse(newDiagnosis.status).text.should.equal(orderStatus.Bought.text);
        });

  });
}

async function GetAllDiagnosis(temp_doctor_hash)
{
  var diagnosisArr=[];
  return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
  .then((assetRegistry) => {
      // re-get the commodity
      return assetRegistry.getAll();
  })
  .then((newDiagnosis) => {

      // console.log(newDiagnosis);
      // let index='-1';
      for(let i=0; i<newDiagnosis.length; i++)
      {
        if(newDiagnosis[i].doctor.$identifier===temp_doctor_hash)
        {
          diagnosisNo = newDiagnosis[i].$identifier;
          console.log('Diagnosis id: '+diagnosisNo + ' \nDoctor id: '+ newDiagnosis[i].doctor.$identifier);
          //index=i;
          diagnosisArr.push(newDiagnosis[i]);
        }

      }
      return diagnosisArr;
  })
}

async function getPatients(diagnosisArr)
{

  var temp_patients_arr=[];

  try {
    // Use connect method to connect to the Server
    let client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    for(let i = 0;i<diagnosisArr.length; i++)
    {
      temp_patients_arr.push(await db.collection('patient').findOne({ patient_id:diagnosisArr[i].patient.$identifier })); 
    }

    return temp_patients_arr;  
    
    } catch (err) {
      console.log(err.stack);
    }
}

async function getDiagnosisById(diagnosisNo)
{

  var diagnosis_obj;

  try {
    // Use connect method to connect to the Server
    let client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    diagnosis_obj = await db.collection('diagnosis').findOne({ diagnosis_id:diagnosisNo }); 
   
    return diagnosis_obj;  
    
    } catch (err) {
      console.log(err.stack);
    }
}


async function displayPatients(result)
{
  for(let i=0;i<result.length;i++)
  {
      console.log((i+1) + '.  Patient Name: ' + result[i].patient_name);
      console.log('    Patient Address: ' + result[i].patient_address);
      
  } 
}

async function displayDiagnosis(diagnosis_obj)
{
    console.log('Age: ' + diagnosis_obj.age);
    console.log('Gender: ' + diagnosis_obj.gender);
    console.log('Total Bilirubin: ' + diagnosis_obj.total_bilirubin);
    console.log('Direct Bilirubin: ' + diagnosis_obj.direct_bilirubin);    
    console.log('Alkaline Phosphotase: ' + diagnosis_obj.alkaline_phosphotase);
    console.log('Alamine Amino Transferase: ' + diagnosis_obj.alamine_amino_transferase);    
    console.log('Asparate Amino Transferase: ' + diagnosis_obj.asparate_amino_transferase);
    console.log('Total Protiens: ' + diagnosis_obj.total_protiens);    
    console.log('Albumin: ' + diagnosis_obj.albumin);
    console.log('Albumin and Globulin Ratio: ' + diagnosis_obj.albumin_and_globulin_ratio);    

        
}

async function ResultByDoctor()
{
  var diagnosis_obj,detailed_diagnosis,prescription_comments;
  var temp_doctor_hash,choice;
  var diagnosisArr=[];
  var temp_patients_arr=[];

  const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          
  // create the RequestDiagnosisAI transaction
  const results = factory.newTransaction(namespace, 'RequestDiagnosisDoctor');

  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Doctor Id? ', (answer) => {
        temp_doctor_hash = answer;
        console.log(`Thank you for your valuable feedback: ${temp_doctor_hash}`)
        resolve()
      })
    })
  }

  await question1();

  diagnosisArr = await GetAllDiagnosis(temp_doctor_hash);

  temp_patients_arr = await getPatients(diagnosisArr);
  
  if(temp_patients_arr.length === 0)
  {
    console.log('Doctor with given ID has no patients !!!');
    return;
  }
   
  await displayPatients(temp_patients_arr);

  const question2 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Enter Your Patient Choice? ', (answer) => {
        choice = answer;
        console.log(`Your choice: ${choice}`)
        resolve()
      })
    })
  }

  await question2();
  
  console.log('before');

  diagnosisNo = await validateDiagnosis(temp_patients_arr[choice-1].patient_id);

  console.log('after ' + diagnosisNo);
  
  diagnosis_obj = await getDiagnosisById(diagnosisNo);

  await displayDiagnosis(diagnosis_obj);

  const question3 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Dear Doctor, Please Enter your detailed diagnosis: ', (answer) => {
        detailed_diagnosis = answer;
        console.log(`Your choice: ${detailed_diagnosis}`)
        resolve()
      })
    })
  }

  const question4 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Kindly Enter Prescription and Extra comments (If Any): ', (answer) => {
        prescription_comments = answer;
        console.log(`Your choice: ${prescription_comments}`)
        resolve()
      })
    })
  }

  await question3();
  await question4();

  try {
    // Use connect method to connect to the Server
    let client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    await db.collection('diagnosis').update({ diagnosis_id:diagnosisNo }, {$set: { detailed_diagnosis_doctor: detailed_diagnosis, prescription_comments: prescription_comments }}); 
    
    } catch (err) {
      console.log(err.stack);
    }

    
}

async function displayLab(result)
{

  for(let i=0;i<result.length;i++)
  {
      console.log((i+1) + '.  Laboratory Name: ' + result[i].laboratory_name);
      console.log('    Doctor Address: ' + result[i].laboratory_address);

  }
  console.log("lab length:" +result.length);
}

async function RequestDataLaboratory()
{
  var temp_patient_hash;
  var lab_name;
  var bool;
  let client;

  const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          
  // create the RequestDataLaboratory transaction
  const createNew = factory.newTransaction(namespace, 'RequestDataLaboratory');

  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Patient Id? ', (answer) => {
        temp_patient_hash = answer;
        console.log(`Thank you for your valuable feedback: ${temp_patient_hash}`)
        resolve()
      })
    })
  }

  await question1();

  bool = await validatePatient(temp_patient_hash);
  // console.log('Hii '+ bool);
  if(bool === false)
  {
    console.log('Patient with given Patient ID is not registered!! Please Register!');
    return;
  } 

  const question2 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Laboratory Name ', (answer) => {
        lab_name = answer;
        console.log(`Thank you for your valuable feedback: ${lab_name}`)
        resolve()
      })
    })
  }

  await question2();

  try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    const db = client.db('testdb');

    var choice,result;
    result = await db.collection('laboratory').find({laboratory_name: lab_name}).toArray();
    console.log("lab length:" +result.length);

    if(result.length === 0)
    {
      console.log('Laboratory with given name not found !!!');
      return;
    }
     
    await displayLab(result);

    // console.log('Finding Doctor ....');
    // await sleep.sleep(3);
        
    const question3 = () => {
      return new Promise((resolve, reject) => {
        rl.question('Enter Your Laboratory Choice? ', (answer) => {
          choice = answer;
          console.log(`Your choice: ${choice}`)
          resolve()
        })
      })
    }

        await question3();
        console.log('before');

        laboratory_id = result[choice-1].laboratory_id;
      
        console.log('after ' + laboratory_id);
         
      
    } catch (err) {
      console.log(err.stack);
    }

  var record_lab = {laboratory_id: laboratory_id, patient_id: temp_patient_hash};
  console.log(record_lab);
  labReport_id = hash(record_lab);

  var report = factory.newResource(namespace, 'LabReport', labReport_id);
  //const patient = factory.newResource(namespace, 'Patient', temp_patient_hash);



  // const doctor = factory.newResource(namespace, 'Doctor', 'null');
  // const laboratory = factory.newResource(namespace, 'Laboratory', 'null');
  // const insurer = factory.newResource(namespace, 'Insurer', 'null');

  console.log('Hii bro'+temp_patient_hash);

  createNew.labReport = factory.newRelationship(namespace, 'LabReport', labReport_id);
  createNew.patient = factory.newRelationship(namespace, 'Patient', temp_patient_hash);
  createNew.laboratory = factory.newRelationship(namespace, 'Laboratory', laboratory_id);
  
  report.patient=factory.newRelationship(namespace, 'Patient', temp_patient_hash);
  report.laboratory = factory.newRelationship(namespace,'Laboratory',laboratory_id)
 

  createNew.labReport.$identifier.should.equal(labReport_id);

  console.log('here'); 
  

          // Get the asset registry.
      return businessNetworkConnection.getAssetRegistry(namespace + '.LabReport')
      .then((assetRegistry) => {

          // add the order to the asset registry.
          return assetRegistry.add(report)
              .then(() => {
                  console.log('here00');
                  return businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
              })
              .then(() => {
                  console.log('here01');
                  return businessNetworkConnection.getParticipantRegistry(namespace + '.Laboratory');
              })
              .then(() => {
                  // submit the transaction
                  console.log('here02');
                  return businessNetworkConnection.submitTransaction(createNew);
              })
              .then(() => {
                  console.log('here03');
                  return businessNetworkConnection.getAssetRegistry(namespace + '.LabReport');
              })
              .then((assetRegistry) => {
                  // re-get the commodity
                  console.log('here04');
                  return assetRegistry.get(report.$identifier);
              })
              .then((newLabReport) => {
                  // the owner of the commodity should not be simon
                  console.log('here05');
                  newLabReport.patient.$identifier.should.equal(temp_patient_hash);
              });
          }); 
    
}

async function getPatientsByLab(temp_laboratory_hash)
{
  var temp_patients_arr=[];

  let client = await MongoClient.connect(url,{ useNewUrlParser: true });

  const db = client.db('testdb');


  return businessNetworkConnection.getAssetRegistry(namespace + '.LabReport')
  .then((assetRegistry) => {
      // re-get the commodity
      return assetRegistry.getAll();
  })
  .then((report) => {

      for(let i=0; i<report.length; i++)
      {
        console.log('Report Length: '+report.length + ' '+temp_laboratory_hash);
        if(report[i].laboratory.$identifier === temp_laboratory_hash)
        {
          temp_patients_arr.push(report[i].patient.$identifier );
        }

      }
      console.log('Patient name: '+temp_patients_arr[0].patient_name);
      return temp_patients_arr;
  })

}

async function displayPatientsById(temp_patients_arr)
{
    try {
    // Use connect method to connect to the Server
        let client = await MongoClient.connect(url,{ useNewUrlParser: true });

        const db = client.db('testdb');
        var cursor;

        for(let i = 0;i<temp_patients_arr.length; i++)
        {
          cursor = await db.collection('patient').findOne({ patient_id:temp_patients_arr[i] }); 

          console.log((i+1) + '.  Patient Name: ' + cursor.patient_name);
          console.log('    Patient Address: ' + cursor.patient_address);
        }
    
    } catch (err) {
      console.log(err.stack);
    }
}

async function DataByLaboratory()
{
  var temp_patient_hash;
  var temp_laboratory_hash;
  let client;
  var choice;

  var total_bilirubin;
  var direct_bilirubin;
  var alkaline_phosphotase;
  var alamine_amino_transferase;
  var asparate_amino_transferase;
  var total_protiens;
  var albumin;
  var albumin_and_globulin_ratio;
  var temp_patients_arr;

  const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
          
  // create the RequestDataLaboratory transaction
  const createNew = factory.newTransaction(namespace, 'DataByLaboratory');

  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Laboratory Id? ', (answer) => {
        temp_laboratory_hash = answer;
        console.log(`Thank you for your valuable feedback: ${temp_laboratory_hash}`)
        resolve()
      })
    })
  }
  
  await question1();


  temp_patients_arr = await getPatientsByLab(temp_laboratory_hash);
  
  if(temp_patients_arr.length === 0)
  {
    console.log('Laboratory with given ID has no patients !!!');
    return;
  }


   
  await displayPatientsById(temp_patients_arr);

  const question2 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Enter Your Patient Choice? ', (answer) => {
        choice = answer;
        console.log(`Your choice: ${choice}`)
        resolve()
      })
    })
  }

  await question2();
  temp_patient_hash = temp_patients_arr[choice-1];
  
  // console.log('before');

  // diagnosisNo = await validateDiagnosis(temp_patients_arr[choice-1].patient_id);

  // console.log('after ' + diagnosisNo);
  
  // diagnosis_obj = await getDiagnosisById(diagnosisNo);

  // await displayDiagnosis(diagnosis_obj);

  const question10 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Total Bilirubin? ', (answer) => {
        total_bilirubin = answer;
        console.log(`Thank you for your valuable feedback: ${total_bilirubin}`)
        resolve()
      })
    })
  }

  const question3 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Direct Bilirubin? ', (answer) => {
        direct_bilirubin = answer;
        console.log(`Thank you for your valuable feedback: ${direct_bilirubin}`)
        resolve()
      })
    })
  }
  
  const question4 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Alkaline Phosphate? ', (answer) => {
        alkaline_phosphotase = answer;
        console.log(`Thank you for your valuable feedback: ${alkaline_phosphotase}`)
        resolve()
      })
    })
  }

  const question5 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Alamine Amino Transferase?  ', (answer) => {
        alamine_amino_transferase = answer;
        console.log(`Thank you for your valuable feedback: ${alamine_amino_transferase}`)
        resolve()
      })
    })
  }

  const question6 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Asparate Amino Transferase? ', (answer) => {
        asparate_amino_transferase =answer;
        console.log(`Thank you for your valuable feedback: ${asparate_amino_transferase}`)
        resolve()
      })
    })
  }
  
  const question7 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Total Proteins? ', (answer) => {
        total_protiens = answer;
        console.log(`Thank you for your valuable feedback: ${total_protiens}`)
        resolve()
      })
    })
  }

  const question8 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Albumin? ', (answer) => {
        albumin = answer;
        console.log(`Thank you for your valuable feedback: ${albumin}`)
        resolve()
      })
    })
  }

  const question9 = () => {
    return new Promise((resolve, reject) => {
      rl.question('Albumin and Globulin ratio? ', (answer) => {
        albumin_and_globulin_ratio = answer;
        console.log(`Thank you for your valuable feedback: ${albumin_and_globulin_ratio}`)
        resolve()
      })
    })
  }

    
    await question10();

    await question3();
    await question4();

    await question5();
    await question6();

    await question7();
    await question8();
    await question9();

  try {
  // Use connect method to connect to the Server
	  client = await MongoClient.connect(url,{ useNewUrlParser: true });
	  var age,gender;
	  var db = client.db('testdb');

	  console.log('patient id here: ' +  temp_patient_hash);

	  var cursor = await db.collection('patient').findOne( {patient_id:temp_patient_hash},{_id:0,patient_age:1,patient_gender:1} );
	  
	  console.log('Age : ' + cursor.patient_age + ' Gender: ' + cursor.patient_gender);
	  
	  var record = { patient_id: temp_patient_hash, age: cursor.patient_age, gender: cursor.patient_gender, total_bilirubin: total_bilirubin, direct_bilirubin: direct_bilirubin, 
	              alkaline_phosphotase: alkaline_phosphotase, alamine_amino_transferase: alamine_amino_transferase, asparate_amino_transferase: asparate_amino_transferase,
	              total_protiens: total_protiens, albumin: albumin, albumin_and_globulin_ratio: albumin_and_globulin_ratio };

	  console.log(record);	
	  var hash_record = hash(record);

	  console.log("This is the hash: " + hash_record);

	  var record_to_be_inserted = { diagnosis_id: hash_record, patient_id: temp_patient_hash, age: cursor.patient_age, gender:cursor.patient_gender, total_bilirubin: total_bilirubin, direct_bilirubin: direct_bilirubin, 
	          alkaline_phosphotase: alkaline_phosphotase, alamine_amino_transferase: alamine_amino_transferase, asparate_amino_transferase: asparate_amino_transferase,
	          total_protiens: total_protiens, albumin: albumin, albumin_and_globulin_ratio: albumin_and_globulin_ratio };

	  diagnosis_id = hash_record;
	  diagnosisNo = diagnosis_id;
	  //db.collection('diagnosis').deleteMany({diagnosis_id: 1001});
	  await db.collection('diagnosis').insertOne(record_to_be_inserted, function (err, result) {
	      if (err) throw err;
	      console.log("1 Diagnosis Inserted");
	  });

  } catch (err) {
  console.log(err.stack);
  }

  if (client) {
      console.log('closing client');
      client.close();
  }	

    var diagnosis = factory.newResource(namespace, 'Diagnosis', diagnosis_id);

	
    createNew.diagnosis = factory.newRelationship(namespace, 'Diagnosis', diagnosis_id);
    createNew.patient = factory.newRelationship(namespace, 'Patient', temp_patient_hash);
    createNew.laboratory = factory.newRelationship(namespace, 'Laboratory', temp_laboratory_hash);
    
    diagnosis.patient = factory.newRelationship(namespace, 'Patient', temp_patient_hash);
    diagnosis.laboratory = factory.newRelationship(namespace,'Laboratory',temp_laboratory_hash);
    diagnosis.doctor = factory.newRelationship(namespace, 'Doctor', 'null');
    diagnosis.insurer = factory.newRelationship(namespace,'Insurer','null');
  
    createNew.diagnosis.$identifier.should.equal(diagnosis_id);
  
    console.log('here'); 
    
  
            // Get the asset registry.
        return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
        .then((assetRegistry) => {
  
            // add the order to the asset registry.
            return assetRegistry.add(diagnosis)
                .then(() => {
                    console.log('here00');
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Patient');
                })
                .then(() => {
                    console.log('here00');
                    return businessNetworkConnection.getParticipantRegistry(namespace + '.Laboratory');
                })
                .then(() => {
                    // submit the transaction
                    console.log('here02');
                    return businessNetworkConnection.submitTransaction(createNew);
                })
                .then(() => {
                    console.log('here03');
                    return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis');
                })
                .then((assetRegistry) => {
                    // re-get the commodity
                    console.log('here04');
                    return assetRegistry.get(diagnosis.$identifier);
                })
                .then((newDiagnosis) => {
                    // the owner of the commodity should not be simon
                    console.log('here05');
                    newDiagnosis.patient.$identifier.should.equal(temp_patient_hash);
                    newDiagnosis.laboratory.$identifier.should.equal(temp_laboratory_hash);

                });
            }); 

}

async function dispalyInsurer(result)
{
  for(let i=0;i<result.length;i++)
  {
      console.log((i+1) + '.  Insurer Name: ' + result[i].insurer_name);
      console.log('    Insurer Address: ' + result[i].insurer_address);

  }
}

async function SendDataInsurance()
{
      var temp_patient_hash;
      var insurer_name;
      var bool;

      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              
      // create the RequestDiagnosisAI transaction
      const results = factory.newTransaction(namespace, 'SendDataInsurance');

      const question1 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Patient Id? ', (answer) => {
            temp_patient_hash = answer;
            console.log(`Thank you for your valuable feedback: ${temp_patient_hash}`)
            resolve()
          })
        })
      }

      await question1();

      bool = await validatePatient(temp_patient_hash);
      // console.log('Hii '+ bool);
      if(bool === false)
      {
        console.log('Patient with given Patient ID is not registered!! Please Register!');
        return;
      } 

      const question2 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Insurer Name ', (answer) => {
            insurer_name = answer;
            console.log(`Thank you for your valuable feedback: ${insurer_name}`)
            resolve()
          })
        })
      }

      await question2();

      try {
        // Use connect method to connect to the Server
        let client = await MongoClient.connect(url,{ useNewUrlParser: true });

        const db = client.db('testdb');

        var choice,result;
        result = await db.collection('insurer').find({insurer_name: insurer_name}).toArray();

        if(result.length === 0)
        {
          console.log('Insurer with given name not found !!!');
          return;
        }
         
        await dispalyInsurer(result);

        // console.log('Finding Doctor ....');
        // await sleep.sleep(3);
            
        const question3 = () => {
          return new Promise((resolve, reject) => {
            rl.question('Enter Your Insurer Choice? ', (answer) => {
              choice = answer;
              console.log(`Your choice: ${choice}`)
              resolve()
            })
          })
        }

            await question3();
            console.log('before');

            insurer_id = result[choice-1].insurer_id;
          
            console.log('after ' + insurer_id);
             
          
        } catch (err) {
          console.log(err.stack);
        }

        // if (client) {
        //     console.log('closing client');
        //     client.close();
        //   }   

        diagnosisNo = await validateDiagnosis(temp_patient_hash);
      
        console.log('here0' + diagnosisNo);

          if(diagnosisNo === 404)
          {
            console.log('Patient with given Diagnosis id is not Registered!!!');
            return;
          }
          console.log('printing before fetch data');

        return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
        .then((assetRegistry) => {
            // re-get the commodity
            return assetRegistry.get(diagnosisNo);
        })
        .then((newDiagnosis) => {
            results.diagnosis = factory.newRelationship(namespace, 'Diagnosis', newDiagnosis.$identifier);
            results.patient = factory.newRelationship(namespace, 'Patient', newDiagnosis.patient.$identifier);
            results.insurer = factory.newRelationship(namespace, 'Insurer', insurer_id);
          
            newDiagnosis.insurer = factory.newRelationship(namespace, 'Insurer', insurer_id);

            return businessNetworkConnection.submitTransaction(results)
            .then(() => {
                return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis');
            })
            .then((assetRegistry) => {
                // re-get the commodity
                return assetRegistry.get(diagnosisNo);
            })
            .then((newDiagnosis_new) => {
                // the owner of the commodity should be patient
                newDiagnosis_new.patient.$identifier.should.equal(temp_patient_hash);
                newDiagnosis_new.insurer.$identifier.should.equal(insurer_id);
                // JSON.parse(newDiagnosis.status).text.should.equal(orderStatus.Bought.text);
            });

      });
}

async function getAllDiagnosisForInsurance(temp_insurer_hash)
{
      var diagnosisArr=[];
      return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
      .then((assetRegistry) => {
          // re-get the commodity
          return assetRegistry.getAll();
      })
      .then((newDiagnosis) => {

          // console.log(newDiagnosis);
          // let index='-1';
          for(let i=0; i<newDiagnosis.length; i++)
          {
            if(newDiagnosis[i].insurer.$identifier===temp_insurer_hash)
            {
              diagnosisNo = newDiagnosis[i].$identifier;
              console.log('Diagnosis id: '+diagnosisNo + ' \nInsurer id: '+ newDiagnosis[i].insurer.$identifier);
              //index=i;
              diagnosisArr.push(newDiagnosis[i]);
            }

          }
          return diagnosisArr;
      })
} 

async function InsuranceResult()
{
      var diagnosis_obj,insurance_result,insurance_comments;
      var temp_insurer_hash,choice;
      var diagnosisArr=[];
      var temp_patients_arr=[];
      var choice;

      const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
              
      // create the RequestDiagnosisAI transaction
      const results = factory.newTransaction(namespace, 'InsuranceResult');

      const question1 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Insurer Id? ', (answer) => {
            temp_insurer_hash = answer;
            console.log(`Thank you for your valuable feedback: ${temp_insurer_hash}`)
            resolve()
          })
        })
      }

      await question1();

      diagnosisArr = await getAllDiagnosisForInsurance(temp_insurer_hash);

      temp_patients_arr = await getPatients(diagnosisArr);
      
      if(temp_patients_arr.length === 0)
      {
        console.log('Insurer with given ID has no insurance claim Request !!!');
        return;
      }
       
      await displayPatients(temp_patients_arr);

      const question2 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Enter Your Patient Choice? ', (answer) => {
            choice = answer;
            console.log(`Your choice: ${choice}`)
            resolve()
          })
        })
      }

      await question2();
      
      console.log('before');

      diagnosisNo = await validateDiagnosis(temp_patients_arr[choice-1].patient_id);

      console.log('after ' + diagnosisNo);
      
      diagnosis_obj = await getDiagnosisById(diagnosisNo);

      await displayDiagnosis(diagnosis_obj);

      const question3 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Dear Insurer, Please Enter your Insurance Claim Result: ', (answer) => {
            insurance_result = answer;
            console.log(`Your choice: ${insurance_result}`)
            resolve()
          })
        })
      }

      const question4 = () => {
        return new Promise((resolve, reject) => {
          rl.question('Kindly Enter Extra comments (If Any): ', (answer) => {
            insurance_comments = answer;
            console.log(`Your choice: ${insurance_comments}`)
            resolve()
          })
        })
      }

      await question3();
      await question4();

      try {
        // Use connect method to connect to the Server
        let client = await MongoClient.connect(url,{ useNewUrlParser: true });

        const db = client.db('testdb');

        await db.collection('diagnosis').update({ diagnosis_id:diagnosisNo }, {$set: { insurance_result: insurance_result, insurance_comments: insurance_comments }}); 
        
        } catch (err) {
          console.log(err.stack);
        }
}


async function main()
{
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@dishant8');

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

    var choice = '0';

    while(true)
    {
        console.log(' 1) Add Patient \n 2) Add Doctor \n 3) Add Laboratory \n 4) Add Insurer');
        console.log(' 5) Register Diagnosis \n 6) Request Diagnosis from AI \n 7) Request Diagnosis from Doctor \n 8) Upload Diagnosis result by Doctor')
        console.log(' 9) Request data from Laboratory \n 10) Upload Patient Data by Laboratory \n 11) Send Data for Insurance \n 12) Upload Insurance Result by Insurer \n  0) Exit ')
        
        const question1 = () => {
            return new Promise((resolve, reject) => {
            rl.question('Enter your Choice? ', (answer) => {
                choice = answer;
                console.log(`You choose choice: ${choice}`);
                resolve()
            })
            })
        }

        await question1();
        console.log('User choice:' + choice);
        
        switch(choice.toString())
        {
            case '0':
                rl.close();
                process.exit(0);
            
            case '1':
                console.log('case 1 ');
                await AddPatient();
                break;

            case '2':
                await AddDoctor();
                break;

            case '3':
                await AddLaboratory();
                break;

            case '4':
                await AddInsurer();
                break;

            case '5':
                await RegisterDiagnosis();
                break;

            case '6':
                await RequestDiagnosisAI();
                await sleep.sleep(5);
                break;

            case '7':
                await RequestDiagnosisDoctor();
                break;
                
            case '8':
                await ResultByDoctor();
                break;

            case '9':
                await RequestDataLaboratory();
                break;

            case '10':
                 await DataByLaboratory();
                 break;

            case '11':
                 await SendDataInsurance();
                 break;

            case '12':
                 await InsuranceResult();
                 break;

            default:
                console.log('Invalid Choice!!');
                break;
            
        }


    } 

}

main();

