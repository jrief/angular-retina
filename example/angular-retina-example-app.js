(function() {
  'use strict';

  angular.module('angularRetinaExampleApp', ['ngRetina'])
    .controller('AngularRetinaExampleController', AngularRetinaExampleController);

  function AngularRetinaExampleController() {
    var vm = this;
    vm.image = 'images/angular.png';
  }
})();
