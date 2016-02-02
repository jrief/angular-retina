'use strict';

describe('when fadeInWhenLoaded is set, image should be invisible until loaded', function() {
  var scope, retinaProvider, $httpBackend, $compile;
  beforeEach(module('ngRetina'));
  beforeEach(module(function(ngRetinaProvider) {
    retinaProvider = ngRetinaProvider;
  }));

  beforeEach(inject(function(_$rootScope_, _$httpBackend_, _$compile_) {
    $httpBackend = _$httpBackend_
    scope = _$rootScope_.$new();
    $compile = _$compile_;
    $httpBackend.when('HEAD', '/image@2x.png').respond(200);
    $httpBackend.when('GET', '/image@2x.png').respond(200);
    retinaProvider.setFadeInWhenLoaded(true);
  }));

  afterEach(function() {
    window.sessionStorage.removeItem("/image.png");
    window.sessionStorage.removeItem("/picture.png");
    retinaProvider.setFadeInWhenLoaded(false);
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should set style with transition and opacity', function() {
    var element = angular.element('<img ng-src="{{image_url}}">');
    scope.image_url = '/image.png';
    $compile(element)(scope);
    scope.$digest();
    var style = element.attr('style');
    expect(style).toMatch(/opacity: 0/);
    expect(style).toMatch(/transition/);
    expect(style).toMatch(/ease-out/);
    expect(style).toMatch(/0\.5s/);
  });

  it('should set opacity to 0 when the image has loaded', function() {
    var element = angular.element('<img ng-src="{{image_url}}">');
    scope.image_url = '/image.png';
    $compile(element)(scope);
    scope.$digest();
    angular.element(element).triggerHandler('load');
    expect(element.attr('style')).toMatch(/opacity: 1/);
  });
});
