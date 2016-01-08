'use strict';

angular.module('app')
  .constant('cordova', typeof cordova !== 'undefined' ? cordova : {})
  .constant('StatusBar', typeof StatusBar !== 'undefined' ? StatusBar : {});
