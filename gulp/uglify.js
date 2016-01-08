'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
  src: {
    useref: conf.paths.tmp + '/useref/**/*',
  },
  dest: conf.paths.tmp + '/uglify'
};

gulp.task('uglify', "Uglify js and css files", function(done) {
  gulp.src(paths.src.useref)
    .on('error', error.prod)
    .pipe($.if('*.css', $.cssnano().on('error', error.prod)))
    .pipe($.if('*.js', $.ngAnnotate().on('error', error.prod)))
    .pipe($.if('*.js', $.uglify().on('error', error.prod)))
    .pipe($.if('*.js', $.replace(/[\x0d]/g, '').on('error', error.prod)))
    .pipe($.if('*.js', $.replace(/([\x00-\x09\x0b-\x1f])/g, function(str, p1) {
      return '\\x' + ('0' + p1.charCodeAt(0).toString(16)).slice(-2);
    }).on('error', error.prod)))
    .pipe(gulp.dest(paths.dest))
    .on('end', done);
});
