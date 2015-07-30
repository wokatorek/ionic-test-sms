'use strict';

angular.module('app').controller('SMSController', function($cordovaSms, $ionicPopup, $scope) {
  var vm = $scope.vm = this;

  vm.recipient = '';
  vm.content = '';

  vm.submit = function() {
    var options = {
      replaceLineBreaks: true, // true to replace \n by a new line, false by default
      android: {
        //intent: 'INTENT'  // send SMS with the native android SMS messaging
        intent: '' // send SMS without open any other app
      }
    };

    $cordovaSms
      .send(vm.recipient, vm.content, options)
      .then(function() {
        $ionicPopup.alert({
          title: "Sukces",
          template: "SMS został wysłany"
        }).then(function() {
          vm.recipient = null;
          vm.content = null;
        });
      })
      .catch(function(error) {
        $ionicPopup.alert({
          title: "Błąd",
          template: "Nie udało się wysłać SMS.<br/>" + error
        });
      });
  };
});
