'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

var browserSync = require('browser-sync');
var mkdirp = require('mkdirp');

var paths = {
  src: {
    js: [
      conf.paths.src + '/**/*.js',
      '!' + conf.paths.bower + '/**/*',
      '!' + conf.paths.src + '/**/*.spec.js',
      '!' + conf.paths.src + '/**/*.mock.js'
    ],
  },
  dest: conf.paths.tmp + '/annotate'
};

function runTask(opts, done) {
  gulp.src(paths.src.js)
    .pipe($.ngAnnotate())
    .on('error', opts.isProd ? error.prod : error.dev)
    .pipe(gulp.dest(paths.dest))
    .on('end', done)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true })));
}

gulp.task('annotate:dev', "Inject styles and scripts into annotate (dev mode)", function(done) {
  runTask({isProd: false}, done);
});

gulp.task('annotate:prod', "Inject styles and scripts into annotate (prod mode)", function(done) {
  runTask({isProd: true}, done);
});

gulp.task('annotate', ['annotate:dev']);

gulp.task('watch:annotate', "Watch for changes in annotated JS", function(done) { // jshint strict:true, unused:vars
  mkdirp(conf.paths.tmp + '/annotate', {}, function() {
    gulp.watch(_(paths.src).values().flatten().value(), ['annotate']);
  });
});
