'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var _ = require('lodash');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var connectLogger = require("connect-logger");
var mkdirp = require('mkdirp');
var proxyMiddleware = require('http-proxy-middleware');
var rewriteModule = require('http-rewrite-middleware');
var runSequence = require('run-sequence');

function browserSyncInit(baseDir, options) {
  if (!options) {
    options = {};
  }

  var server = {
    baseDir: baseDir
  };

  server.middleware = [];

  if (conf.server.log) {
    server.middleware.push(connectLogger());
  }

  if (conf.server.proxy) {
    _.forOwn(conf.server.proxy, function(options, url) {
      server.middleware.push(proxyMiddleware(url, options));
    });
  }

  if (conf.server.prefix && conf.server.prefix !== '/') {
    server.middleware.push(rewriteModule.getMiddleware([
      {from: '^' + conf.server.prefix + '(.*)$', to: '/$1'}
    ]));
  }

  browserSync.instance = browserSync.init(_.defaults(options, {
    startPath: conf.server.prefix,
    server: server,
    browser: conf.browser,
    logConnections: true,
    timestamps: true
  }));
}

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'// Only needed for angular apps
}));

var paths = {
  src: {
    browser: [
      conf.paths.tmp + '/html',
      conf.paths.tmp + '/constants',
      conf.paths.tmp + '/sass',
      conf.paths.src,
      '.'
    ],
    watch: [
      conf.paths.src + '/**/*',
      conf.paths.bower + '/**/*'
    ]
  },
  dev: conf.paths.dest,
  prod: conf.paths.dest
};

gulp.task('serve:src', "Run dev app in browser from source folder", function(done) {
  runSequence('sass:dev', 'constants:dev', 'html:dev', function() {
    browserSyncInit(paths.src.browser, {open: false});
    done();
  });
});

gulp.task('serve:dev', "Run dev app in browser from dest folder", ['build:dev'], function(done) { // jshint strict:true, unused:vars
  browserSyncInit(paths.dev);
});

gulp.task('serve:prod', "Run prod app in browser from dest folder", ['build:prod'], function(done) { // jshint strict:true, unused:vars
  browserSyncInit(paths.prod, {injectChanges: false, codeSync: false});
});

gulp.task('serve', "Run dev app and watch for changes", function(done) { // jshint strict:true, unused:vars
  runSequence('sass:dev', 'constants:dev', 'html:dev', 'lint:dev', function() {
    browserSyncInit(paths.src.browser);
    mkdirp(conf.paths.tmp + '/html/', {}, function() {
      $.watch(paths.src.watch, browserSync.reload);
      gulp.start('watch');
    });
  });
});
