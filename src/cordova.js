'use strict';

// mocked cordova.js for tests in browser

/* exported sms */
var sms = {
  send: function(number, message, options, success, fail) {
    if (message && message.indexOf('error') === -1) {
      success('Mocked success');
    } else {
      // fail if message contains "error" string
      fail('Mocked error');
    }
  }
};
