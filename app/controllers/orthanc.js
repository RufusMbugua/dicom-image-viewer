var express = require('express');
var router = express.Router();
var request = require('request');
var async =  require('async');

var orthanc = 'http://orthanc.rufusmbugua.com/';


var patient = [];
var patients = [];
var patientData=[];
var complete=false;
/* GET home page. */
router.get('/patients', function(req, res, next) {

  async.series([
    get_patients,
    iterate_over_patients,
    // return_patients
  ], function (err, results) {
    console.log(results)
  });



});

router.get('/dicom', function(req, res, next) {

});

router.get('/patients', function(req, res, next) {

});

function get_patients(callback){
  request(orthanc + 'patients')
  .on('data',function(data){
    patients = JSON.parse(data)
  });
}
function iterate_over_patients(callback){
  for(i=0;i<patients.length;i++){
    patient = patients[i];
    get_patient()
  }
}
function get_patient(){
  request(orthanc + 'patients/'+patient)
  .on('data',function(data){
    patientData.push(JSON.parse(data))
    console.log(JSON.parse(data))
  });
}

function return_patients(callback){
  callback(null,patientData)
}
module.exports = router;
