var express = require('express');
var router = express.Router();
var request = require('request');

var orthanc = 'http://orthanc.rufusmbugua.com/';


var patient = [];
var patientsData=[];
/* GET home page. */
router.get('/patients', function(req, res, next) {

  var patient;
  request(orthanc + 'patients')
  .on('data',function(data){
    patients = JSON.parse(data);
  })
  .on('end',function(){
    for (i = 0; i < patients.length; i++) {
      patientId = patients[i];
      request(orthanc + 'patients/' + patientId)
      .on('data',function(data){
        patient = JSON.parse(data);
      })
      .on('end',function(){
        patientsData.push(patient)
        if(patientsData.length==patients.length){
          res.json(patientsData)
        }
      })

    }

  })

});

router.get('/dicom', function(req, res, next) {

});

router.get('/patients', function(req, res, next) {

});

function format_patient_data(patientArray) {
  patientArray = JSON.parse(patientArray)
  return patientArray;

  for (i = 0; i < patientArray.length; i++) {
    patientId = patientArray[i];
    patient = get_patient(patientId);
    // patients.push(patient)
  }
  // return patients;
}

function get_patients(){

}
function get_patient(patientId){
  request(orthanc + 'patients/' + patientId)
  .on('data',function(data){
    patient
  })
}

module.exports = router;
