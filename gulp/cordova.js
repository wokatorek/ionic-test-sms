'use strict';

/* jshint strict:true, node:true */

var conf = require('../config');

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var mkdirp = require('mkdirp');
var runSequence = require('run-sequence');

var fs = require('fs');
var et = require('elementtree');

function getAndroidTargetSdkVersion() {
  var data = fs.readFileSync(__dirname + '/../config.xml').toString();
  var etree = et.parse(data);
  var el = etree.find("./preference[@name='android-targetSdkVersion']");
  return el.get('value');
}

function getAndroidCommand() {
  return process.env.ANDROID_HOME ? process.env.ANDROID_HOME + '/tools/android' : 'android';
}

function getCordovaPlatforms() {
  var data = fs.readFileSync(__dirname + '/../config.xml').toString();
  var etree = et.parse(data);
  return etree.findall("./engine").map(function(el) { return el.get('name'); });
}

function getCordovaPlugins() {
  var data = fs.readFileSync(__dirname + '/../config.xml').toString();
  var etree = et.parse(data);
  return etree.findall("./plugin").map(function(el) { return el.get('name'); });
}

var platforms = getCordovaPlatforms();
var plugins = getCordovaPlugins();

platforms.forEach(function(platform) {
  gulp.task('cordova:build:' + platform, "Build Cordova project (release) for " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      gulp.src('')
        .pipe($.shell('cordova build --release ' + platform))
        .on('end', done);
    });
  });

  gulp.task('cordova:build:' + platform + ':dev', "Build Cordova project (debug) for " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      gulp.src('')
        .pipe($.shell('cordova build --debug ' + platform))
        .on('end', done);
    });
  });

  gulp.task('cordova:clean:' + platform, "Clean Cordova project folder for " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      gulp.src('')
        .pipe($.shell('cordova clean ' + platform))
        .on('end', done);
    });
  });

  gulp.task('cordova:platforms:install:' + platform, "Install Cordova platform " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      var version = platform === 'android' ? getAndroidTargetSdkVersion() : undefined;
      var android = version ? getAndroidCommand() : undefined;
      gulp.src('')
        .pipe($.shell('cordova platform add ' + platform + ' --save'))
        .pipe($.if(!!version, $.shell(android + ' update project --subprojects --path platforms/android --target android-' + version + ' --library CordovaLib')))
        .on('end', done);
    });
  });

  gulp.task('cordova:platforms:update:' + platform, "Update Cordova platform " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      var version = platform === 'android' ? getAndroidTargetSdkVersion() : undefined;
      var android = version ? getAndroidCommand() : undefined;
      gulp.src('')
        .pipe($.shell('cordova platform update ' + platform + ' --save'))
        .pipe($.if(!!version, $.shell(android + ' update project --subprojects --path platforms/android --target android-' + version + ' --library CordovaLib')))
        .on('end', done);
    });
  });

  gulp.task('cordova:run:' + platform, "Run Cordova project (release) on " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      gulp.src('')
        .pipe($.shell('cordova run --release ' + platform))
        .on('end', done);
    });
  });

  gulp.task('cordova:run:' + platform + ':dev', "Run Cordova project (debug) on " + platform, function(done) {
    mkdirp(conf.paths.dest, {}, function() {
      gulp.src('')
        .pipe($.shell('cordova run --debug ' + platform))
        .on('end', done);
    });
  });
});

gulp.task('cordova:build', "Build Cordova project for all platforms", function(done) {
  runSequence(platforms.map(function(platform) {
    return 'cordova:build:' + platform + ':dev';
  }), done);
});

gulp.task('cordova:clean', "Clean all Cordova project folders", function(done) {
  runSequence(platforms.map(function(platform) {
    return 'cordova:clean:' + platform;
  }), done);
});

gulp.task('cordova:platforms:install', "Install all Cordova platforms", function(done) {
  runSequence(platforms.map(function(platform) {
    return 'cordova:platforms:install:'+platform;
  }), done);
});

gulp.task('cordova:platforms:update', "Update all Cordova platforms", function(done) {
  runSequence(platforms.map(function(platform) {
    return 'cordova:platforms:update:'+platform;
  }), done);
});

gulp.task('cordova:plugins:install', "Install all Cordova plugins", function(done) {
  mkdirp(conf.paths.dest, {}, function() {
    gulp.src('')
      .pipe($.shell('cordova plugin add ' + plugins.join(' ') + ' --save'))
      .on('end', done);
  });
});

gulp.task('cordova:plugins:upgrade', "Upgrade all Cordova plugins", function(done) {
  var installedPlugins = [];
  try {
    installedPlugins = Object.keys(JSON.parse(fs.readFileSync(__dirname + '/../plugins/fetch.json').toString()));
  } catch(e) {
  }
  mkdirp(conf.paths.dest, {}, function() {
    gulp.src('')
      .pipe($.if(!!plugins, $.shell('cordova plugin rm ' + installedPlugins.join(' ') + ' --save')))
      .pipe($.shell('cordova plugin add ' + plugins.join(' ') + ' --save'))
      .on('end', done);
  });
});

gulp.task('cordova:run', "Run Cordova project on all platforms", function(done) {
  runSequence(platforms.map(function(platform) {
    return 'cordova:run:' + platform + ':dev';
  }), done);
});
