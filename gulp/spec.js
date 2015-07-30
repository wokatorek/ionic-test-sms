'use strict';

var gulp = require('gulp');

var karma = require('karma').Server;

gulp.task('spec', "Run spec tests", function(done) {
  new karma({
    configFile: __dirname + '/../karma.conf.js',
    reporters: ['spec'],
    singleRun: true
  }, done).start();
});

gulp.task('watch:spec', "Watch for changes in JS files and run spec tests", function(done) {
  new karma({
    configFile: __dirname + '/../karma.conf.js',
    reporters: ['dots'],
    singleRun: false
  }, done).start();
});
