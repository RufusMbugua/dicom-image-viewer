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
    patients = result;
    res.json(result)
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
    request(orthanc + 'patients/' + patientId,function(err, response, body){
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
    callback(null,extended)
  });
}

module.exports = router;
