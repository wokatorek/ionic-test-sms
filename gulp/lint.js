'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var es = require('event-stream');
var events = require('events');
var logSymbols = require('log-symbols');
var path = require('path');

var emmitter = new events.EventEmitter();

var notify = $.notify;
notify.logLevel(0);

var paths = {
  src: [
    './*.js',
    conf.paths.src + '/**/*.js',
    conf.paths.gulp + '/**/*.js',
    '!' + conf.paths.bower + '/**/*'
  ],
};

var errorNotifier = notify(function(file) {
  if (file.jshint.success) {
    return false;
  }
  var errors = file.jshint.results.map(function(data) {
    if (data.error) {
      return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
    }
  }).join("\n");
  return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
});

function runTask(opts) {
  return gulp.src(paths.src)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(opts.isProd, $.jshint.reporter('fail')))
    .pipe($.if(!opts.isProd, errorNotifier));
}

gulp.task('lint:dev', "Detect errors in JavaScript code (dev mode)", function() {
  return runTask({isProd: false});
});

gulp.task('lint:prod', "Detect errors in JavaScript code (prod mode)", function() {
  return runTask({isProd: true});
});

gulp.task('lint', ['lint:dev']);

gulp.task('watch:lint', "Watch for changes in JS files and run lint", function(done) { // jshint strict:true, unused:vars
  $.watch(paths.src, function(file) {

    var successReporter = es.map(function(file, cb) {
      if (file.jshint.success) {
        console.log(file.path + "\n  " + logSymbols.success + " No problems\n");
      }
      cb(null, file);
    });

    var failReporter = es.map(function(file, cb) {
      if (!file.jshint.success) {
        var errors = file.jshint.results.map(function(data) {
          if (data.error) {
            return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
          }
        }).join("\n");
        emmitter.emit('error', new Error(file.relative + " (" + file.jshint.results.length + " errors)\n" + errors));
      }
      cb(null, file);
    });

    var errorNotifier = function(error) {
      notify.onError({
        title: "JSHint warning",
        message: "<%= error.message %>"
      }).apply(this, [error]);
    };

    if (file.event === 'add' || file.event === 'change') {
      gulp.src(path.relative(__dirname + '/..', file.path))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(successReporter)
        .pipe(failReporter)
        .on('error', errorNotifier);
    }
  });
});
