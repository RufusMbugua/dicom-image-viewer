var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'DIV'
  });
});
router.get('/dicom', function(req, res, next) {
  res.render('dicom', {
    title: 'DIV : Images'
  });
});

router.get('/patients', function(req, res, next) {
  res.render('patients', {
    title: 'DIV : Patients'
  });
});

module.exports = router;
