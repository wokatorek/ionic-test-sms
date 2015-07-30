'use strict';

var conf = require('../config');

var gulp   = require('gulp');
var $ = require('gulp-load-plugins')();

var es = require('event-stream');
var logSymbols = require('log-symbols');
var path = require('path');

var paths = {
  src: [
    conf.paths.src + '/**/*.js',
    conf.paths.gulp + '/**/*.js',
    '!' + conf.paths.bower + '/**/*'
  ],
};

function runTask(opts) {
  return gulp.src(paths.src)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(opts.isProd, $.jshint.reporter('fail')));
}

gulp.task('lint:dev', "Detect errors in JavaScript code (dev mode)", function() {
  return runTask({isProd: false});
});

gulp.task('lint:prod', "Detect errors in JavaScript code (prod mode)", function() {
  return runTask({isProd: true});
});

gulp.task('lint', ['lint:dev']);

gulp.task('watch:lint', "Watch for changes in JS files and run lint", function(done) { // jshint ignore:line
  var cwd = process.cwd();
  $.watch(paths.src, function(file) {

    var successReporter = es.map(function(file, cb) {
      if (file.jshint.success) {
        console.log(file.path + "\n  " + logSymbols.success + " No problems\n");
      }
      cb(null, file);
    });

    if (file.event === 'add' || file.event === 'change') {
      gulp.src(path.relative(cwd, file.path))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(successReporter);
    }

  });
});
