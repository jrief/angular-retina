'use strict';

describe('when loadErrorHandler is set, it should be called when there is a load error', function() {

  beforeEach(function() {
    module(function($provide) {
      $provide.provider('$window', function() {
        this.$get = function() {
          try {
            window.devicePixelRatio = 2;
          } catch (TypeError) {
            // in Firefox window.devicePixelRatio only has a getter
          }
          window.matchMedia = function(query) {
            return {matches: true};
          };
          return window;
        };
      });
    });
  });

  var scope, retinaProvider, $httpBackend, $compile, $timeout;

  beforeEach(module('ngRetina'));
  beforeEach(module(function(ngRetinaProvider) {
    retinaProvider = ngRetinaProvider;
  }));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$compile_, _$timeout_) {
    $httpBackend = _$httpBackend_
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend.expect('HEAD', '/image@2x.png').respond(404);
    $timeout = _$timeout_;
  }));

  afterEach(function() {
    window.sessionStorage.removeItem('/image.png');
    window.sessionStorage.removeItem('/image@2x.png');
    retinaProvider.setLoadErrorHandler(angular.noop);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be called on 404', function(done) {
    retinaProvider.setLoadErrorHandler(function(event, data) {
      expect(event.type).toEqual('error');
      done();
    });

    var element = angular.element('<img ng-src="/image.png">');
    $compile(element)(scope);
    scope.$digest();
    $httpBackend.flush();
  });
});
