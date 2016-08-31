/**
* Declarations
*/
// Packages
var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

// Variables
var orthanc = 'http://orthanc.rufusmbugua.com/';
var patients = [];

/* GET Patients List */
router.get('/patients', function(req, res, next) {
  async.waterfall([
    get_patients,
    get_patient,
  ],
  function (err, result) {
    if(err){
      res.send('Error in Connection')
    }
    patients = result;
    result = result.map(transform_patients);
    res.json(result)
  });
});

router.get('/instances',function(req, res, next){
  var instances = req.query.list;
  async.map(instances,get_instance,
  function (err, result) {
    if(err){
      res.send('Error in Connection')
    }
    var instance_files = result;
    res.send(instance_files)
  });
});


/**
* [get_patients description]
* @param  {[type]} waterfallCallback [description]
* @return {[type]}                   [description]
*/
function get_patients(waterfallCallback){
  request(orthanc + 'patients')
  .on('data',function(data){
    patients = JSON.parse(data);
  })
  .on('end',function(){
    waterfallCallback(null,patients)
  })
}

/**
* [get_patient description]
* @param  {[type]} patients [description]
* @return {[type]}          [description]
*/
function get_patient(patients,callback){

  async.map(patients, function(patientId, callback) {
    request(orthanc + 'patients/' + patientId + '/studies',function(err, response, body){
      if (err) {
        return callback(err);
      }
      patient = JSON.parse(body);

      async.map(patient,get_series,
        function(err,extended){
          if (err) {
            // handle error
          }
          // extended is an array containing the parsed JSON
          callback(null,extended)
        })
      });
    }, function(err, extended) {
      if (err) {
        // handle error
      }
      // extended is an array containing the parsed JSON
      callback(null,extended)
    });
  }

  function get_series(study,callback){
    async.map(study.Series, function(series, callback) {

      request(orthanc + 'series/' + series,function(err, response, body){
        if (err) {
          return callback(err);
        }
        callback(null, JSON.parse(body));
      })
    }, function(err, extended) {
      if (err) {
        // handle error
      }
      // extended is an array containing the parsed JSON
      // console.log(study)
      study.seriesList = extended;
      callback(null,study)
    });
  }

  function get_instance(instance,callback){
      request(orthanc + 'instances/' + instance + '/file',function(err, response, body){
        if (err) {
          return callback(err);
        }
        callback(null, body);
      })

  }

  function transform_patients(patient){
    var obj = {};

    obj.id = patient[0].ID;
    obj.patient_name = patient[0].PatientMainDicomTags.PatientName.split('^').join(' ');
    obj.institution_name = (patient[0].MainDicomTags.InstitutionName)?patient[0].MainDicomTags.InstitutionName.split('^').join(' '): ' ';
    obj.requesting_physician = (patient[0].MainDicomTags.RequestingPhysician)? patient[0].MainDicomTags.RequestingPhysician.split('^').join(' '): ' ';
    obj.study_description = patient[0].MainDicomTags.StudyDescription.split('^').join(' ');
    obj.last_update = patient[0].PatientMainDicomTags.LastUpdate;
    obj.series_count = patient[0].Series.length;
    obj.series_list = patient[0].seriesList;

    return obj;
  }

  module.exports = router;
