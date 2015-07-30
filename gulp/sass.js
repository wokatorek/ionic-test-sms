'use strict';

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

var paths = {
  src: [
    conf.paths.src + '/**/*.scss',
    '!' + conf.paths.bower + '/**/*'
  ],
  dest: conf.paths.tmp + '/sass'
};

function runTask(opts, done) {
  gulp.src(paths.src)
    .pipe($.sass({
      errLogToConsole: true,
      sourceComments: opts.isProd ? 'none' : 'map',
      sourceMap: 'sass',
      outputStyle: opts.isProd ? 'compressed' : 'nested'
    }))
    .pipe(gulp.dest(paths.dest))
    .on('error', opts.isProd ? error.prod : error.dev)
    .on('end', done)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true })));
}

gulp.task('sass:dev', "Build CSS from Sass stylesheets (dev mode)", function(done) {
  runTask({isProd: false}, done);
});

gulp.task('sass:prod', "Build CSS from Sass stylesheets (prod mode)", function(done) {
  runTask({isProd: true}, done);
});

gulp.task('sass', ['sass:dev']);

gulp.task('watch:sass', "Watch for changes in Sass", function(done) { // jshint ignore:line
  $.watch(paths.src, function() {
    runSequence('sass');
  });
});
