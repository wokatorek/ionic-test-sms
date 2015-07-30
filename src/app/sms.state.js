'use strict';

angular.module('app').config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('sms', {
      url: '/sms',
      templateUrl: 'app/sms.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/sms');

});
