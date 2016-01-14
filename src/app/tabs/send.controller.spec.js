'use strict';

describe('SMSController', function() {
  var $scope;
  var vm;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope) {
    $scope = $rootScope.$new();
    vm = $controller('SMSController', {$scope: $scope});
  }));

  describe('vm', function() {
    it("initial variables are correct", function() {
      expect(vm.recipient).to.equal('');
      expect(vm.content).to.equal('');
    });
  });

});
