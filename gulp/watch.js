'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var runSequence = require('run-sequence');

var paths = [
  'gulpfile.js',
  'gulp/*.js'
];

gulp.task('watch:gulp', "Watch for changes in gulp scripts", function(done) { // jshint ignore:line
  $.watch(paths, function() {
    console.log("gulp files was changed: exiting...");
    process.exit();
  });
});

gulp.task('watch', "Watch for all changes", function(done) { // jshint ignore:line
  runSequence([
    'watch:gulp',
    'watch:sass',
    'watch:inject',
    'watch:lint',
    'watch:spec'
  ]);
});
