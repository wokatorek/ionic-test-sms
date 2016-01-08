'use strict';

/* jshint strict:true, node:true */

var gulp = require('gulp');
var gutil = require('gulp-util');

var karma = require('karma');
var runSequence = require('run-sequence');

gulp.task('spec', "Run spec tests", function(done) {
  runSequence('constants:dev', function() {
    new karma.Server({
      configFile: __dirname + '/../karma.conf.js',
      reporters: ['spec', 'notify'],
      singleRun: true
    }, function(status) {
      if (status) {
         gutil.log(new Error("Karma spec failed"));
      }
      done();
    }).start();
  });
});

gulp.task('watch:spec', "Watch for changes in JS files and run spec tests", function(done) {
  runSequence('constants:dev', function() {
    new karma.Server({
      configFile: __dirname + '/../karma.conf.js',
      reporters: ['dots', 'notify'],
      singleRun: false
    }, done).start();
  });
});
