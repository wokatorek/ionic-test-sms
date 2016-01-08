'use strict';

angular.module('app').run(function($ionicPlatform, cordova, StatusBar) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (cordova && cordova.plugins && cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (StatusBar && StatusBar.styleLightContent) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
});
