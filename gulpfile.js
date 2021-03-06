var gulp = require('gulp');
var elixir = require('laravel-elixir');
var bower = require('main-bower-files');
var bowerNormalizer = require('gulp-bower-normalize');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var order = require('gulp-order');
var sass = require('gulp-sass');
var refresh = require('gulp-refresh')
var rename = require("gulp-rename");
var jade = require("gulp-jade");
var docco = require("gulp-docco");

var paths = {
  scripts: 'public/app/**/*.js',
  sass: 'public/assets/sass/**/*.scss',
  html: 'public/app/**/*.html',
  jade: 'app/views/**/*.jade'
};


/*
|--------------------------------------------------------------------------
| Elixir Asset Management
|--------------------------------------------------------------------------
|
| Elixir provides a clean, fluent API for defining some basic Gulp tasks
| for your Laravel application. By default, we are compiling the Less
| file for our application, as well as publishing vendor resources.
|
*/



/*
* Compile Assets
*/
gulp.task('scripts', function() {
  return gulp.src('./public/app/**/*.js')
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./public/js/'))
  .pipe(refresh());
});

gulp.task('sass', function () {
  return gulp.src('./public/assets/sass/styles.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('./public/css'))
  .pipe(refresh());
});

gulp.task('process-libs', function() {
  elixir(function(mix) {
    mix.scriptsIn('public/libs/', 'public/js/libs.js');
  });
});

gulp.task('bower', function() {
  gulp.src(bower(), {
    base: './bower_components'
  })
  .pipe(bowerNormalizer({
    bowerJson: './bower.json',
    flatten: true
  }))
  .pipe(gulp.dest('public/libs'))
});

gulp.task('move_fonts', function() {
  gulp.src('public/libs/fonts/**/*')
  .pipe(gulp.dest('public/fonts'));
});

gulp.task('clean', function() {
  gulp.src('public/libs', {
    read: false
  })
  .pipe(clean());
})

// Watch for changes
gulp.task('watch', function() {
  refresh.listen();
  gulp.watch(paths.scripts, ['default']);
  gulp.watch(paths.sass, ['default']);
  gulp.watch(paths.html, ['default']);
  gulp.watch(paths.jade, ['default']);
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('./app/views/dicom.jade')

  .pipe(
    jade({
      locals: YOUR_LOCALS
    }))
    .pipe(
      rename(function (path) {
        path.extname = ".tpl.html";
        return path;
      })
    )
    .pipe(gulp.dest('./public/app/modules/images/'))
  });


  gulp.task('doc:backend',function(){
    var options = {
      css: "./documentation/backend/docco.css"
    }
    gulp.src("./app/controllers/*.js")
    .pipe(docco(options))
    .pipe(gulp.dest('./documentation/backend'));
  })

  // Default Task
  gulp.task('default', ['templates', 'bower','scripts','sass']);
