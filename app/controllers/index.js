// # Main Routes
// Package Initialization
var express = require('express');
var router = express.Router();
var path = require('path');

// ## Default Route `/`
router.get('/', function(req, res, next) {
  // Render the `index.jade` view
  res.render('index', {
    // Set the `title` attribute
    title: 'DIV'
  });
});

router.get('/documentation', function(req, res, next) {
  options = {
    root:'./documentation/backend/'
  }
  res.sendFile('orthanc.html',options)
});

module.exports = router;
