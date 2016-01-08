'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');

var paths = {
  src: {
    scss: [
      conf.paths.src + '/**/*.scss',
      '!' + conf.paths.src + '/**/_*.scss',
      '!' + conf.paths.bower + '/**/*'
    ],
    inj: [
      conf.paths.src + '/**/*.inj.scss',
      '!' + conf.paths.bower + '/**/*'
    ],
    assets: conf.paths.src
  },
  dest: conf.paths.tmp + '/sass'
};

function runTask(opts, done) {
  gulp.src(paths.src.inj)
    .pipe($.inject(gulp.src(paths.src.scss, {read: false}), {
      addRootSlash: false,
      name: 'inject',
      transform: function(filePath) {
        return '@import "' + filePath + '";';
      },
      starttag: '// inject:scss',
      endtag: '// endinject'
    }))
    .pipe($.inject(gulp.src(bowerFiles('**/*.scss', {includeDev: !opts.isProd}), {read: false}), {
      addRootSlash: false,
      name: 'bower',
      transform: function(filePath) {
        return '@import "' + filePath + '";';
      },
      starttag: '// bower:scss',
      endtag: '// endinject'
    }))
    .pipe($.sass({
      errLogToConsole: true,
      sourceComments: opts.isProd ? 'none' : 'map',
      sourceMap: 'sass',
      outputStyle: opts.isProd ? 'compressed' : 'nested'
    }))
    .on('error', opts.isProd ? error.prod : error.dev)
    .pipe($.cssBase64())
    .pipe($.extReplace('.css', '.inj.css'))
    .pipe($.stripbom())
    .pipe(gulp.dest(paths.dest))
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

gulp.task('watch:sass', "Watch for changes in Sass", function(done) { // jshint strict:true, unused:vars
  gulp.watch(paths.src.scss, ['sass']);
});
