'use strict';

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    minify      = require('gulp-minify-css'),
    jade        = require('gulp-jade'),
    watch       = require('gulp-watch'),
    prefix      = require('gulp-autoprefixer'),
    del         = require('del'),
    server      = require('./server'),
    kss         = require('gulp-kss'),
    browserSync = require('browser-sync'),
    yarg        = require('yargs').argv,
    gulpif      = require('gulp-if'),
    plumber     = require('gulp-plumber'),
    beep        = require('beepbeep'),
    colors      = require('colors'),
    stripDebug  = require('gulp-strip-debug'),
    replace     = require('gulp-regex-replace');


// * extra features *
// - js lint
// - blazy js bower


//
// Paths
// -------------------------------------------------------------

// Defaults

var SOURCE = 'source/',
    BUILD  = 'build/',
    PUBLIC = 'public/',
    ASSETS = 'assets/',
    BOWER  = 'bower_components/',
    STYLES = ASSETS + 'styles/',
    JS     = ASSETS + 'scripts/',
    IMAGES = ASSETS + 'images/',
    FONTS  = ASSETS + 'fonts/';

// Project specific

var PROJECTNAME   = 'prototype-seed';



// 
// YARGS
// --------------------------------------------------------------

// Build variables
var isPrototype         = true;
var browserSyncEnabled  = true;
var debug               = true;
var ugly                = true;
var beepbeep            = true;
var console             = true;


// Groups
if(yarg.dev || yarg.prod) {
  isPrototype   = false;
}
else {
  //console.log('Building prototype code');
}


// Singles
if(yarg.prod) {
  console.log('Running in production mode');
  isPrototype           = false;
  browserSyncEnabled    = false;
  debug                 = false;
  noUgly                = false;
  beepbeep              = false;
  console               = false;
}

if(yarg.dev) {
  console.log('Running in development mode');
  browserSyncEnabled   = false;
}



if(yarg.debug) {
  console.log('Debugging is now active');
  debug = true;
}

if(yarg.nougly) {
  ugly = false;
}

if(yarg.console) {
  console = true;
}

if(yarg.holdthehorn) {
  beepbeep = false;
}
else if( yarg.beepbeep) {
  beepbeep = true;
}


if(yarg.help) {
  console.log(
    'HELP \n' +
    'Options:'.underline 
  );

  console.log(
    '--dev : '.bold + 'Runs the project with everything but browserSync.' + '\n' +
    '--prod : '.bold + 'Builds the project. Alle dev funcitons are turned off'
  );

  process.exit();
}


// gulpif https://github.com/robrich/gulp-if


//
// TASKS
// -------------------------------------------------------------


// CSS
gulp.task('css', function() {
  var FILES = SOURCE + STYLES + '*.scss';
  gulp.src(FILES)
    .pipe(plumber(function () {
        if(beepbeep) {
          beep();
        }
        console.log('[sass]'.bold.magenta + ' There was an issue compiling Sass\n'.bold.red);
        console.log('Error:'.bold + error.message);
        this.emit('end');
    }))
    .pipe(sass({ errLogToConsole: true }))
    .pipe(prefix("last 1 version", "> 1%", "ie 9"))
    .pipe(gulpif(ugly, minify().on('error', function (error) { console.warn(error.message); })))
    .pipe(gulp.dest(BUILD + STYLES))
    .pipe(gulpif(isPrototype,  browserSync.reload({stream: true}) ) ); 
});


// JS
gulp.task('js', function() {
  var FILES = [ 
    BOWER + 'jquery/dist/jquery.js',
    BOWER + 'fitvids/jquery.fitvids.js',
    BOWER + 'jquery-validation/dist/jquery-validate.js',
    SOURCE + JS + 'globals/*.js',
    SOURCE + JS + 'libraries/*.js',
    SOURCE + JS +  '*.js'
  ];
  
  gulp.src(FILES)
    .pipe(gulpif(ugly, uglify().on('error', function (error) { console.warn(error.message); })))
    .pipe(gulpif(!console ,stripDebug()))
    .pipe(gulpif(!console ,replace({regex:'^((?!function)consoleLog)\\(*.+\\);', replace:''}))) // remove consoleLog() but not def: function consoleLog()
    .pipe(concat('main.js'))
    .pipe(gulp.dest(BUILD + JS))
    .pipe(gulpif(isPrototype, browserSync.reload({stream: true}) ) ); 
});

// JADE
gulp.task('jade', function() {
  var FILES = SOURCE + '*.jade';
  gulp.src(FILES)
    .pipe(jade({ pretty: true }))
    .pipe(plumber(function () {
        if(beepbeep) {
          beep();
        }
        console.log('[jade]'.bold.tomato + ' There was an issue compiling Sass\n'.bold.red);
        this.emit('end');
    }))
    .pipe(gulp.dest(BUILD) )
    .pipe(gulpif(isPrototype,  browserSync.reload({stream: true}) ) ); 
});


// IMAGES
gulp.task('images', function() {
  var FILES = SOURCE + IMAGES + '*.*';
  gulp.src(FILES)
    .pipe( gulp.dest(BUILD + IMAGES) );
});


// FONTS
gulp.task('fonts', function() {
  var FILES = SOURCE + FONTS + '*.*';
  gulp.src(FILES)
    .pipe( gulp.dest(BUILD + FONTS));
});


// VENDOR
gulp.task('vendor', function() {
  var FILES = [
    BOWER + 'modernizr/modernizr.js',
    BOWER + 'respond/src/respond.js' ];
  gulp.src(FILES)
      .pipe(concat('vendor.js'))
      .pipe(uglify())
      .pipe(gulp.dest(BUILD + JS));
});


// CLEAN
gulp.task('clean', function(cb){
  del([BUILD], cb);
});


// PUBLIC
gulp.task('public', function() {
  var FILES = PUBLIC + '**/*.*';
  gulp.src(FILES)
    .pipe( gulp.dest(BUILD));
});


// STYLEGUIDE
gulp.task('kss', function() {
  gulp.src([SOURCE + STYLES + '**/*.scss'])
      .pipe(kss({
        overview: 'README.md',
        templateDirectory: SOURCE + 'styleguide-template/'
      }))
      .pipe(gulp.dest(BUILD + 'styleguide/'));
});

// --- Bringing it all together in a build task ---
gulp.task('build', ['js', 'css', 'jade', 'images', 'fonts', 'vendor', 'public', 'kss']);



// --- Setting up browser sync - see https://github.com/shakyShane/browser-sync ---
gulp.task('browser-sync', ['build'], function() {
  if(browserSyncEnabled) {
    browserSync({ server: { baseDir: BUILD } });
  }
});


// --- Let gulp keep an eye on our files and compile stuff if it changes ---
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(SOURCE + STYLES + '**/*.scss',['css', 'kss']);

  gulp.watch(SOURCE + '**/*.jade',['jade']);

  gulp.watch(SOURCE + JS + '**/*.js',['js']);

  gulp.watch(SOURCE + IMAGES + '*.*',['images']);

  gulp.watch([SOURCE + 'styleguide-template/**/*.*', 'README.md'],['kss']);
});


// --- Default gulp task, run with gulp. - Starts our project and opens a new browser window.
gulp.task('default', ['watch']);


// --- Heroku Task. Is only run when deployed to heroku.
gulp.task('heroku', ['build'], function() {
  var port = process.env.PORT || 3000;

  server.listen(port, function() {
    console.log("Listening on " + port);
  });
});