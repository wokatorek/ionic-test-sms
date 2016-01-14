'use strict';

angular.module('app').config(function($stateProvider) {
  $stateProvider
    .state('sms', {
      url: '/sms',
      abstract: true,
      templateUrl: 'app/sms.html'
    });
});