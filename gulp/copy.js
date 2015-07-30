'use strict';

var conf = require('../config');

var gulp = require('gulp');

var bowerFiles = require('main-bower-files');
var merge2 = require('merge2');
var runSequence = require('run-sequence');

var paths = {
  src: [
    conf.paths.src + '/**/*',
    conf.paths.tmp +  '/sass/**/*',
    conf.paths.tmp + '/inject/**/*',
    '!' + conf.paths.bower + '/**/*',
    '!' + conf.paths.src + '/**/*.inj.*',
    '!' + conf.paths.src + '/**/*.scss',
    '!' + conf.paths.src + '/**/*.spec.*'
  ],
  dest: conf.paths.dest
};

gulp.task('copy:dev', "Copy dev files into dest folder", function (done) {
  runSequence('sass:dev', 'inject:prod', 'lint:dev', function() {
    merge2(
      gulp.src(paths.src),
      gulp.src(bowerFiles(), {base: process.cwd() + '/' + conf.paths.src}))
      .pipe(gulp.dest(paths.dest))
      .on('end', done);
  });
});

gulp.task('copy', ['copy:dev']);
