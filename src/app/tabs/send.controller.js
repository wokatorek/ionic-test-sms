'use strict';

angular.module('app').controller('SendController', function(
    $ionicPlatform,
    $ionicPopup,
    $scope,
    cordovaSms
) {
  var vm = $scope.vm = this;
  vm.recipient = '';
  vm.content = '';

  vm.submit = function() {

    $ionicPlatform.ready(function() {
      cordovaSms
        .send(vm.recipient, vm.content)
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
