// # Orthanc controller
// ## Underlying Principle
// ```
// +- patient
// |  |+-- study
// |  |  |+-- series
// |  |  |  |+---instance
// |  |  |  |+---instance
// |  |  |+-- series
// |  |+-- study
// +- patient
// |  |+-- study
// |    |+-- series
// |      |+---instances
//```
// Package Initialization
var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');

// Variable Initialization
var orthanc = 'http://orthanc.rufusmbugua.com/';
var patients = [];

// ## Routes
// ### Patients
// `GET` Patients List
router.get('/patients', function(req, res, next) {
  // Employing `async.waterfall()` to run the functions in order
  async.waterfall([
    // Call the Get Patients `function()`
    get_patients,
    // Call the Get Patient `function()`
    get_patient,
  ],
  function (err, result) {
    if(err){
      // handle error
      res.send('Error in Connection')
    }
    patients = result;
    // Parse the Patients `Array` through a **Transformer** to *clean* the data
    result = result.map(transform_patients);
    // Return the result as a JSON object
    res.json(result)
  });
});

// ## Core Functions
//
// All core functions are implementing `request` as well as `async`
// to build the final **Patients List**
//
// ### Get Patients
// This is the initial request that starts the *Waterfall*
function get_patients(waterfallCallback){
  // Request for the patients information from the **ORTHANC** server
  request(orthanc + 'patients')
  .on('data',function(data){
    // Parse the resulting JSON data into an `Array` for iteration later.
    patients = JSON.parse(data);
  })
  .on('end',function(){
    // Return the resultant `Array` to the *Waterfall*
    waterfallCallback(null,patients)
  })
}

// ### Get Patient
function get_patient(patients,callback){
// We use `async.map()` to iterate through the Patients `Array`
  async.map(patients, function(patientId, callback) {
    // Request for each patient's  study information
    request(orthanc + 'patients/' + patientId + '/studies',function(err, response, body){
      if (err) {
        // handle error
        return callback(err);
      }
      // Parse the resulting JSON data into an `Array`.
      patient = JSON.parse(body);
      // We use another `async.map` to start the new `Array` rebuild.
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

  // ### Get series
  function get_series(study,callback){
    // We use `async.map()` to get the **Series** for each **Study**
    async.map(study.Series, function(series, callback) {
      // Request to get the **Instances** for each **Series**
      request(orthanc + 'series/' + series,function(err, response, body){
        if (err) {
          // handle error
          return callback(err);
        }
        // Return `response.body` to Callback
        callback(null, JSON.parse(body));
      })
    }, function(err, extended) {
      if (err) {
        // handle error
      }
      // extended is an array containing the parsed JSON
      study.seriesList = extended;
      callback(null,study)
    });
  }

  // ### Patients `Array` Transformer
  function transform_patients(patient){
    // Initialize the new `Object`
    // #### Patient Attributes
    var obj = {};
    // Patient ID `int`
    obj.id = patient[0].ID;
    // Patient Name `string`
    obj.patient_name = patient[0].PatientMainDicomTags.PatientName.split('^').join(' ');
    // Institution name `string`
    obj.institution_name = (patient[0].MainDicomTags.InstitutionName)?patient[0].MainDicomTags.InstitutionName.split('^').join(' '): ' ';
    // Requesting Physician `string`
    obj.requesting_physician = (patient[0].MainDicomTags.RequestingPhysician)? patient[0].MainDicomTags.RequestingPhysician.split('^').join(' '): ' ';
    // Study Description `string`
    obj.study_description = patient[0].MainDicomTags.StudyDescription.split('^').join(' ');
    // Last Update `date`
    obj.last_update = patient[0].PatientMainDicomTags.LastUpdate;
    // Series Count `int`
    obj.series_count = patient[0].Series.length;
    // Series List `Object`
    obj.series_list = patient[0].seriesList;
    // Return the Patient `Object`
    return obj;
  }

  module.exports = router;
