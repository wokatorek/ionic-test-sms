'use strict';

var conf = require('../config');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var connectLogger = require("connect-logger");
var mkdirp = require('mkdirp');
var runSequence = require('run-sequence');

// var proxyMiddleware = require('http-proxy-middleware');

function browserSyncInit(baseDir) {
  var server = {
    baseDir: baseDir
  };

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: conf.browser,
    logConnections: true,
    middleware: [
      connectLogger()
      // proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});
    ],
    timestamps: true
  });
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

var paths = {
  src: {
    browser: [
      conf.paths.tmp + '/inject',
      conf.paths.tmp + '/sass',
      conf.paths.src
    ],
    watch: [
      conf.paths.src + '/**/*',
      conf.paths.bower + '/**/*'
    ]
  },
  dev: conf.paths.dest
};

gulp.task('serve:src', "Run dev app in browser from source folder", function(done) { // jshint ignore:line
  runSequence('sass:dev', 'inject:dev', 'lint:dev', function() {
    browserSyncInit(paths.src.browser);
    mkdirp(conf.paths.tmp + '/inject/', {}, function() {
      $.watch(paths.src.watch, browserSync.reload);
      gulp.start('watch');
    });
  });
});

gulp.task('serve:dev', "Run dev app in browser from dest folder", ['copy:dev'], function(done) { // jshint ignore:line
  browserSyncInit(paths.dev);
});

gulp.task('serve', ['serve:src']);
