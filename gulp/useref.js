'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

var paths = {
  src: {
    js: [
      conf.paths.tmp + '/templates',
      conf.paths.tmp + '/constants',
      conf.paths.src
    ],
    css: [
      conf.paths.tmp + '/sass',
      conf.paths.src
    ],
    html: [
      conf.paths.tmp + '/html/**/*'
    ]
  },
  dest: conf.paths.tmp + '/useref'
};

gulp.task('useref', "Link js and css files", function(done) {
  gulp.src(paths.src.html)
    .on('error', error.prod)
    .pipe($.useref({searchPath: _.union(paths.src.js, paths.src.css)}).on('error', error.prod))
    .pipe($.inlineSource({rootpath: '.'}).on('error', error.prod))
    .pipe(gulp.dest(paths.dest))
    .on('end', done);
});
