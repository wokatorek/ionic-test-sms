'use strict';

angular.module('app').controller('SMSController', function($scope, $state, $log) {
  $scope.vm = this;

  this.neoid = null;

  this.submit = function() {
    $log.debug('SMSController.submit');
  };
});
