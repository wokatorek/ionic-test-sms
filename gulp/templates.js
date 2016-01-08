'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

var browserSync = require('browser-sync');
var mkdirp = require('mkdirp');
var path = require('path');

var paths = {
  src: [
    conf.paths.src + '/*/**/*.html',
    '!' + conf.paths.bower + '/**/*'
  ],
  dirs: [
    conf.paths.src + '/',
    conf.paths.tmp + '/sass/'
  ],
  dest: conf.paths.tmp + '/templates'
};

function runTask(opts, done) {
  gulp.src(conf.angular.templates || paths.src)
    .pipe($.if(function(file) {
      return opts.isProd && path.extname(file.path) === '.html';
    }, $.htmlmin({collapseWhitespace: true, empty: true})))
    .pipe($.ngTemplates({
      filename: 'templates.js',
      module: conf.angular.module,
      standalone: false,
    }))
    .on('error', opts.isProd ? error.prod : error.dev)
    .pipe(gulp.dest(paths.dest))
    .on('end', done)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true })));
}

gulp.task('templates:dev', "Build all AngularJS templates (dev mode)", function(done) {
  runTask({isProd: false}, done);
});

gulp.task('templates:prod', "Build all AngularJS templates (prod mode)", function(done) {
  runTask({isProd: true}, done);
});

gulp.task('templates', ['templates:dev']);

gulp.task('watch:templates', "Watch for changes in templates HTML", function(done) { // jshint strict:true, unused:vars
  mkdirp(conf.paths.tmp + '/html/', {}, function() {
    gulp.watch(_(paths.src).values().flatten().value(), ['templates']);
  });
});
