'use strict';

angular.module('app').controller('ReadController', function ($ionicPlatform,
                                                             $ionicPopup,
                                                             $scope,
                                                             cordovaSms) {
  var vm = $scope.vm = this;
  vm.recipient = '';
  vm.content = '';

  vm.messages = [];

  $ionicPlatform.ready(function () {
    var filter = {
      box: 'inbox', // 'inbox' (default), 'sent', 'draft', 'outbox', 'failed', 'queued', and '' for all

      // following 4 filters should NOT be used together, they are OR relationship
      read: 1, // 0 for unread SMS, 1 for SMS already read
      //_id : 1234, // specify the msg id
      //address : '+8613601234567', // sender's phone number
      //body : 'This is a test SMS', // content to match

      // following 2 filters can be used to list page up/down
      indexFrom: 0, // start from index 0
      maxCount: 10, // count of SMS to return each time
    };
    cordovaSms.read(filter)
      .then(function (data) {
        console.log(data);
        vm.messages = data;
      })
      .catch(function (err) {
        console.log('READ ERROR: '+err);
      });
  });

});
