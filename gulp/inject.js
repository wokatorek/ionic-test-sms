'use strict';

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

var bowerFiles = require('main-bower-files');
var browserSync = require('browser-sync');
var mkdirp = require('mkdirp');
var runSequence = require('run-sequence');

var paths = {
  src: {
    css: [
      conf.paths.src + '/**/*.css',
      conf.paths.tmp + '/sass/**/*.css',
      '!' + conf.paths.bower + '/**/*'
    ],
    js: [
      conf.paths.src + '/**/*.js',
      '!' + conf.paths.bower + '/**/*',
      '!' + conf.paths.src + '/**/*.spec.js',
      '!' + conf.paths.src + '/**/*.mock.js'
    ],
    html: [
      conf.paths.src + '/*.inj.html'
    ],
  },
  dirs: [
    conf.paths.src + '/',
    conf.paths.tmp + '/sass/'
  ],
  dest: conf.paths.tmp + '/inject'
};

function runTask(opts, done) {
  gulp.src(paths.src.html)
    .pipe($.inject(gulp.src(paths.src.css, {read: false}), {ignorePath: paths.dirs, addRootSlash: !opts.isProd}))
    .pipe($.inject(gulp.src(paths.src.js)/*.pipe($.angularFilesort())*/, {ignorePath: paths.dirs, addRootSlash: !opts.isProd}))
    .pipe($.inject(gulp.src(bowerFiles({includeDev: !opts.isProd}), {read: false}), {ignorePath: paths.dirs, addRootSlash: !opts.isProd, name: 'bower'}))
    .pipe($.extReplace('.html', '.inj.html'))
    .on('error', opts.isProd ? error.prod : error.dev)
    .pipe(gulp.dest(paths.dest))
    .on('end', done)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true })));
}

gulp.task('inject:dev', "Inject styles and scripts into HTML (dev mode)", function(done) {
  runTask({isProd: false}, done);
});

gulp.task('inject:prod', "Inject styles and scripts into HTML (prod mode)", function(done) {
  runTask({isProd: true}, done);
});

gulp.task('inject', ['inject:dev']);

gulp.task('watch:inject', "Watch for changes in injected HTML", function(done) { // jshint ignore:line
  mkdirp(conf.paths.tmp + '/sass/', {}, function() {
    $.watch(_(paths.src).values().flatten().value(), function() {
      runSequence('inject');
    });
  });
});
