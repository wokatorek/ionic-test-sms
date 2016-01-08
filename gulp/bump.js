'use strict';

/* jshint strict:true, node:true */

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('bump', "Change version number for Cordova app", $.cordovaBump);
