'use strict';

// mocked cordova.js for tests in browser

/* exported SMS */
var SMS = {
  sendSMS: function(address, text, successCallback, failureCallback) {
    if (text && text.indexOf('error') === -1) {
      successCallback('Mocked success');
    } else {
      // fail if text contains "error" string
      failureCallback('Mocked error');
    }
  }
};
