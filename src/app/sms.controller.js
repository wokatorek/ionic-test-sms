'use strict';

angular.module('app').controller('SMSController', function(
    $cordovaSms,
    $ionicPlatform,
    $ionicPopup,
    $scope
) {
  var vm = $scope.vm = this;
  vm.recipient = '';
  vm.content = '';

  vm.submit = function() {
    $ionicPlatform.ready(function() {
      $cordovaSms
        .send(vm.recipient, vm.content, {
          replaceLineBreaks: true, // true to replace \n by a new line, false by default
          android: {
            //intent: 'INTENT'  // send SMS with the native android SMS messaging
            intent: '' // send SMS without open any other app
          }
        })
        .then(function() {
          $ionicPopup.alert({
            title: "Success",
            template: "SMS was sent"
          }).then(function() {
            $scope.recipient = '';
            $scope.content = '';
          });
        })
        .catch(function(error) {
          $ionicPopup.alert({
            title: "Failure",
            template: "Could not send SMS.<br/>" + error
          });
        });
    });
  };
});
