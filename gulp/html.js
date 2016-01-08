'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var eventStream = require('event-stream');
var mkdirp = require('mkdirp');

var paths = {
  src: {
    css: [
      conf.paths.src + '/**/*.css',
      conf.paths.tmp + '/sass/**/*.css',
      '!' + conf.paths.bower + '/**/*',
      '!' + conf.paths.src + '/inline/**/*'
    ],
    js: [
      conf.paths.src + '/**/*.js',
      conf.paths.tmp + '/templates/**/*.js',
      '!' + conf.paths.bower + '/**/*',
      '!' + conf.paths.src + '/cordova.js',
      '!' + conf.paths.src + '/inline/**/*',
      '!' + conf.paths.src + '/**/*.spec.js',
      '!' + conf.paths.src + '/**/*.mock.js'
    ],
    inj: [
      conf.paths.src + '/*.inj.html'
    ],
  },
  dirs: [
    conf.paths.src + '/',
    conf.paths.tmp + '/sass/',
    conf.paths.tmp + '/gettext/',
    conf.paths.tmp + '/templates/'
  ],
  dest: conf.paths.tmp + '/html'
};

function runTask(opts, done) {
  gulp.src(paths.src.inj)
    .pipe($.inject(eventStream.merge(
      gulp.src(paths.src.js).pipe($.angularFilesort()),
      gulp.src(paths.src.css, {read: false})
    ), {ignorePath: paths.dirs, addRootSlash: false}))
    .pipe($.inject(gulp.src(bowerFiles({includeDev: !opts.isProd}), {read: false}), {ignorePath: paths.dirs, addRootSlash: !opts.isProd, name: 'bower'}))
    .pipe($.extReplace('.html', '.inj.html'))
    .on('error', opts.isProd ? error.prod : error.dev)
    .pipe(gulp.dest(paths.dest))
    .on('end', done)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true })));
}

gulp.task('html:dev', "Inject styles and scripts into HTML (dev mode)", function(done) {
  runTask({isProd: false}, done);
});

gulp.task('html:prod', "Inject styles and scripts into HTML (prod mode)", function(done) {
  runTask({isProd: true}, done);
});

gulp.task('html', ['html:dev']);

gulp.task('watch:html', "Watch for changes in injected HTML", function(done) { // jshint strict:true, unused:vars
  mkdirp(conf.paths.tmp + '/sass/', {}, function() {
    gulp.watch(_(paths.src).values().flatten().value(), ['html']);
  });
});
