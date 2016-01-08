'use strict';

angular.module('app').directive('validSubmit', function($parse) {
  return {
    require: '^form',
    restrict: 'A',
    link: function(scope, element, attrs, form) {
      var func = $parse(attrs.validSubmit);
      element.on('submit', function(event) {
        scope.$apply(function() {
          if (form.$valid) {
            if (typeof func === 'function') {
              func(scope, {$event: event});
            }
          }
        });
      });
    }
  };
});
