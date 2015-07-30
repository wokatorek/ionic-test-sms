'use strict';

angular.module('app').controller('SMSController', function($cordovaSms, $ionicPopup, $scope) {
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
        $ionicPopup.alert({
          title: "Sukces",
          template: "SMS został wysłany"
        }).then(function() {
          $scope.vm.recipient = null;
          $scope.vm.content = null;
        });
      }, function(error) {
        $ionicPopup.alert({
          title: "Błąd",
          template: "Nie udało się wysłać SMS.<br/>" + error
        });
      });
  };
});
