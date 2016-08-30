var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var assets = require('connect-assets');

var Changelog = require('generate-changelog');
var Fs        = require('fs');




app.use(assets({
  paths: [
    'public/libs/js',
    'public/libs/css',
    'public/js',
    'public/css',
    'public/scripts',
    'public/assets/images'
  ]
}));

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

//set secret string for jwt token
app.set('jwtTokenSecret', 'secret_string_00');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./app/controllers/index');
var orthanc = require('./app/controllers/orthanc');

//Routes are created here
app.use('/', routes);
app.use('/orthanc', orthanc);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

Changelog.generate({ patch: true, repoUrl: 'https://gitlab.com/rufusmbugua/dicom-image-parser' })
.then(function (changelog) {
  Fs.writeFileSync('./CHANGELOG.md', changelog);
});
