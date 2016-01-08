'use strict';

angular.module('app').config(function($urlRouterProvider, DEFAULT_STATE) {
  var defaultUrl = '/' + DEFAULT_STATE.replace(/\./g, '/');
  // if none of the defined states are matched, use this as the fallback
  $urlRouterProvider.otherwise(defaultUrl);
});
