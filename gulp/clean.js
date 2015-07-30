'use strict';

var conf = require('../config');

var gulp = require('gulp');

var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean:tmp', "Clean temporary folder", function (done) {
  del(conf.paths.tmp, done);
});

gulp.task('clean:dest', "Clean dest folder", function (done) {
  del(conf.paths.dest, done);
});

gulp.task('clean', "Clean all folders", function(done) {
  runSequence('clean:dest', 'clean:tmp', 'clean:cordova', done);
});
