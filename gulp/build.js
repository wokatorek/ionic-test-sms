'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var _ = require('lodash');

var bowerFiles = require('main-bower-files');
var merge2 = require('merge2');
var runSequence = require('run-sequence');

var removeEmptyDirectories = require('remove-empty-directories');

var paths = {
  src: {
    dev: {
      assets: [
        conf.paths.src + '/**/*',
        conf.paths.tmp +  '/sass/**/*',
        conf.paths.tmp + '/constants/**/*',
        conf.paths.tmp + '/templates/**/*',
        conf.paths.tmp + '/html/**/*',
        '!' + conf.paths.bower + '/**/*',
        '!' + conf.paths.src + '/**/*.inj.*',
        '!' + conf.paths.src + '/**/*.scss',
        '!' + conf.paths.src + '/**/*.spec.*'
      ],
      bower: [
        '**/*',
        '!**/*.scss'
      ]
    },
    prod: {
      js: [
        conf.paths.tmp + '/constants',
        conf.paths.tmp + '/templates',
        //conf.paths.tmp + '/annotate',
        conf.paths.src
      ],
      css: [
        conf.paths.tmp + '/sass',
        conf.paths.src
      ],
      assets: [
        conf.paths.src + '/**/*',
        '!' + conf.paths.bower + '/**/*',
        '!' + conf.paths.src + '/**/*.html',
        '!' + conf.paths.src + '/**/*.js',
        '!' + conf.paths.src + '/**/*.scss',
      ],
      bower: [
        '**/*',
        '!**/*.js',
        '!**/*.scss'
      ],
    },
    uglify: [
      conf.paths.tmp + '/uglify/**/*'
    ]
  },
  dest: conf.paths.dest
};

gulp.task('build:dev', "Build dev files into dest folder", function(done) {
  runSequence('sass:dev', 'constants:dev', 'html:prod', 'lint:dev', function() {
    merge2(
      gulp.src(paths.src.dev.assets),
      gulp.src(bowerFiles(paths.src.dev.bower), {base: process.cwd() + '/' + conf.paths.src}))
      .pipe(gulp.dest(paths.dest))
      .on('end', done);
  });
});

gulp.task('build:prod', "Build prod files into dest folder", function(done) {
  runSequence('clean', 'sass:prod', 'constants:prod', 'templates:prod', 'html:prod', /*'lint:prod',*/ 'useref', 'uglify', function() {
    merge2(
      gulp.src(_.flatten([paths.src.prod.assets, paths.src.uglify])),
      gulp.src(conf.assets),
      gulp.src(bowerFiles(paths.src.prod.bower), {base: process.cwd() + '/' + conf.paths.src}))
      .on('error', error.prod)
      .pipe(gulp.dest(paths.dest))
      .on('end', function() {
        removeEmptyDirectories(paths.dest);
        conf.fixture(done);
      });
  });
});

gulp.task('build', ['build:prod']);
