'use strict';

/* jshint strict:true, node:true */

var gulp = require('gulp');
var help = require('gulp-help');
var requireDir = require('require-dir');

help(gulp);

requireDir('./gulp');
