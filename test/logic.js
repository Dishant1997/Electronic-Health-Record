
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

    py.stdin.write(JSON.stringify(diagnosisNo));
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

    console.log('UPDATE SUCCESS 3 ' + dataString);
         

    console.log('UPDATE SUCCESS 4 ' + dataString);

}


async function fetchData()
{
    let client;
    
    try {
    // Use connect method to connect to the Server
    client = await MongoClient.connect(url,{ useNewUrlParser: true });

    var db = client.db('testdb');
    var record = await db.collection('diagnosis').findOne({hash: diagnosisNo});

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


describe('Diagnosis Network', function () {
    this.timeout(_timeout);
    let businessNetworkConnection;
    before(function () {
        businessNetworkConnection = new BusinessNetworkConnection();
        return businessNetworkConnection.connect('admin@dishant8');
    });

    describe('#AddPatient' + namespace, async () => {
        it('should be able to register a patient', async () =>{
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

            var rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            })


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
                rl.close();

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
            
        });
    });

    describe('#AddDoctor' + namespace, async () => {
      it('should be able to register a patient', async () =>{
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

          var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })


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
            


              rl.close();
 
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

          createNewDoctor.doctor = factory.newRelationship(namespace, 'Doctor', doctor.$identifier);
          
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
          
      });
  });


  describe('#AddLaboratory' + namespace, async () => {
    it('should be able to register a patient', async () =>{
        const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        

        //const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
        //doctor.unsucessfulDiagnosis=5;
        // create the RegisterDiagnosis transaction
        

        let client;
        
        var laboratory_name;
        var laboratory_email;
        var laboratory_mobile;
        var laboratory_address;

        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })


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


            rl.close();

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
        
      });
  });
  
  describe('#AddInsurer' + namespace, async () => {
    it('should be able to register a patient', async () =>{
        const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
        

        //const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
        //doctor.unsucessfulDiagnosis=5;
        // create the RegisterDiagnosis transaction
        

        let client;
        
        var insurer_name;
        var insurer_email;
        var insurer_mobile;
        var insurer_address;

        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })


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


            rl.close();

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
        
        });
    });


    describe('#RegisterDiagnosis' + namespace, async () => {
        it('should be able to register a patient', async () =>{
            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            //create a patient
            const patient = factory.newResource(namespace, 'Patient', patient_id);

            // const doctor = factory.newResource(namespace, 'Doctor', doctorNo);
            // doctor.unsucessfulDiagnosis=5;
            // create the RegisterDiagnosis transaction
            const createNew = factory.newTransaction(namespace, 'RegisterDiagnosis');

            let client;
            var diagnosis_id =37;
            var age = 20;
            var gender = "Male";
            var total_bilirubin = 0.7;
            var direct_bilirubin = 0.1;
            var alkaline_phosphotase = 108;
            var alamine_amino_transferase = 17;
            var asparate_amino_transferase = 17;
            var total_protiens = 6.8;
            var albumin = 3.3;
            var albumin_and_globulin_ratio = 0.9;
            
            try {
            // Use connect method to connect to the Server
            client = await MongoClient.connect(url,{ useNewUrlParser: true });

            const db = client.db('testdb');

            var record = { diagnosis_id: diagnosis_id, patient_id: patient_id, age: age, gender: gender, total_bilirubin: total_bilirubin, direct_bilirubin: direct_bilirubin, 
                        alkaline_phosphotase: alkaline_phosphotase, alamine_amino_transferase: alamine_amino_transferase, asparate_amino_transferase: asparate_amino_transferase,
                        total_protiens: total_protiens, albumin: albumin, albumin_and_globulin_ratio: albumin_and_globulin_ratio };

            console.log(record);	
            var hash_record = hash(record);

            console.log("This is the hash: " + hash_record);

            var record_to_be_inserted = { hash: hash_record, diagnosis_id: diagnosis_id, patient_id: patient_id, age: age, gender: gender, total_bilirubin: total_bilirubin, direct_bilirubin: direct_bilirubin, 
                    alkaline_phosphotase: alkaline_phosphotase, alamine_amino_transferase: alamine_amino_transferase, asparate_amino_transferase: asparate_amino_transferase,
                    total_protiens: total_protiens, albumin: albumin, albumin_and_globulin_ratio: albumin_and_globulin_ratio };

            diagnosisNo = hash_record;
            db.collection('diagnosis').deleteMany({diagnosis_id: 1001});
            db.collection('diagnosis').insertOne(record_to_be_inserted, function (err, result) {
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

            console.log('here0' + diagnosisNo);
            //create an empty diagnosis template

            var diagnosis = factory.newResource(namespace, 'Diagnosis', diagnosisNo);
            console.log('here1');
            diagnosis = createDiagnosisTemplate(diagnosis);
            console.log('here2');
            diagnosis.diagnosisNumber=diagnosisNo;
            console.log('here3');

            createNew.diagnosis = factory.newRelationship(namespace, 'Diagnosis', diagnosis.$identifier);
            createNew.patient = factory.newRelationship(namespace, 'Patient', patient.$identifier);
            
            diagnosis.patient=factory.newRelationship(namespace, 'Patient', patient.$identifier);
            //diagnosis.doctor=factory.newRelationship(namespace, 'Doctor', doctor.$identifier);
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
                        .then((participantRegistry) => {
                            // add the buyer and seller
                            console.log('here01');
                            return participantRegistry.addAll([patient]);
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
                            newDiagnosis.patient.$identifier.should.equal(patient_id);
                        });
                    });
            
        });
    });

    describe('#RequestDiagnosisAI' + namespace, async () => {
        it('should be able to return the test results from machine learning model', async () =>{

            const factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            
            // create the RequestDiagnosisAI transaction
            const results = factory.newTransaction(namespace, 'RequestDiagnosisAI');

            console.log('Data Inserted');

            console.log('here0' + diagnosisNo);
            //create an empty diagnosis template

            return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis')
            .then((assetRegistry) => {
                // re-get the commodity
                return assetRegistry.get(diagnosisNo);
            })
            .then((newDiagnosis) => {

                newDiagnosis.patient.$identifier.should.equal(patient_id);
                newDiagnosis.$identifier.should.equal(diagnosisNo);

                fetchData();

                results.diagnosis = factory.newRelationship(namespace, 'Diagnosis', newDiagnosis.$identifier);
                results.patient = newDiagnosis.patient;
                //results.doctor = newDiagnosis.doctor;
                results.diagnosis.$identifier=diagnosisNo;
                // submit the transaction
                return businessNetworkConnection.submitTransaction(results)
                    .then(() => {
                        return businessNetworkConnection.getAssetRegistry(namespace + '.Diagnosis');
                    })
                    .then((assetRegistry) => {
                        // re-get the commodity
                        return assetRegistry.get(diagnosisNo);
                    })
                    .then((newDiagnosis) => {
                        // the owner of the commodity should be patient
                        newDiagnosis.patient.$identifier.should.equal(patient_id);
                       // JSON.parse(newDiagnosis.status).text.should.equal(orderStatus.Bought.text);
                    });

            });
            
        });
    });

});      