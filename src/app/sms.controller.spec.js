'use strict';

describe('SMSController', function() {
  var $scope;
  var vm;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();
    vm = $controller('SMSController', {$scope: $scope});
  }));

  describe('$scope.vm', function() {
    it("is the same as controller's this", function() {
      expect($scope.vm).to.equal(vm);
    });
  });

});
