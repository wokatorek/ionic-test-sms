'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');

var gulp = require('gulp');

var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean:tmp', "Clean temporary folder", function() {
  return del(conf.paths.tmp);
});

gulp.task('clean:dest', "Clean dest folder", function() {
  return del(conf.paths.dest);
});

gulp.task('clean', "Clean all folders", function(done) {
  runSequence('clean:dest', 'clean:tmp', 'cordova:clean', done);
});
