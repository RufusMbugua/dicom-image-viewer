var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Dicom Web'
  });
});
router.get('/dicom', function(req, res, next) {
  res.render('dicom', {
    title: 'Dicom Web'
  });
});

module.exports = router;
