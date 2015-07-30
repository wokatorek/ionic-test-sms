'use strict';

var $ = require('gulp-load-plugins')();

module.exports = {
  dev: function(error) { // jshint ignore:line
    var args = Array.prototype.slice.call(arguments);

    // Send error to notification center with gulp-notify
    $.notify.onError({
      title: "Compile Error",
      message: "<%= error.message %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
  },

  prod: function(error) {
    // Log the error and stop the process
    // to prevent broken code from building
    console.log(error);
    process.exit(1);
  }
};
