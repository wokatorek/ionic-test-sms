'use strict';

/* globals SMS:true */

angular.module('app').factory('cordovaSms', function ($q) {
  return {
    send: function (address, text) {
      var q = $q.defer();
      SMS.sendSMS(address, text, function (res) {
        q.resolve(res);
      }, function (err) {
        q.reject(err);
      });
      return q.promise;
    }
  };
});
