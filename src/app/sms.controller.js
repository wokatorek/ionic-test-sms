'use strict';

angular.module('app').controller('SMSController', function($cordovaSms, $scope, $state, $log) {
  $scope.vm = this;

  this.recipient = null;
  this.content = null;

  this.submit = function() {
    var options = {
        replaceLineBreaks: true, // true to replace \n by a new line, false by default
        android: {
            //intent: 'INTENT'  // send SMS with the native android SMS messaging
            intent: '' // send SMS without open any other app
        }
    };

    $cordovaSms
      .send(this.recipient, this.content, options)
      .then(function() {
        // Success! SMS was sent
        $log.info("SMS success");
      }, function(error) {
        // An error occurred
        $log.error(error);
      });
  };
});
