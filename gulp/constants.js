'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');
var error = require('./error');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var b2v = require('buffer-to-vinyl');
var browserSync = require('browser-sync');

var paths = {
  src: [
    'config.js',
    'local.js'
  ],
  dest: conf.paths.tmp + '/constants'
};

function runTask(opts, done) {
  var env = opts.isProd ? 'prod' : 'dev';
  var json = JSON.stringify(conf.constants[env]);

  return b2v.stream(new Buffer(json), 'constants.js')
    .pipe($.ngConfig('app', {
      createModule: false,
      environment: env,
      wrap: '"use strict";\n\n<%= module %>'
    }))
    .on('error', opts.isProd ? error.prod : error.dev)
    .pipe(gulp.dest(paths.dest))
    .on('end', done)
    .pipe($.if(browserSync.active, browserSync.reload({ stream: true })));
}

gulp.task('constants:dev', "Build all AngularJS constants (dev mode)", function(done) {
  runTask({isProd: false}, done);
});

gulp.task('constants:prod', "Build all AngularJS constants (prod mode)", function(done) {
  runTask({isProd: true}, done);
});

gulp.task('constants', ['constants:dev']);

gulp.task('watch:constants', "Watch for changes in constants HTML", function(done) { // jshint strict:true, unused:vars
  gulp.watch(paths.src, ['constants']);
});
