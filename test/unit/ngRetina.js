'use strict';

describe('test module angular-retina', function() {
  var $window;

  describe('on high resolution displays', function() {
    var $httpBackend, scope, retinaProvider;

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

    beforeEach(module('ngRetina'));
    beforeEach(module(function(ngRetinaProvider) {
      retinaProvider = ngRetinaProvider;
    }));

    beforeEach(inject(function($injector, $rootScope) {
      scope = $rootScope.$new();
      $httpBackend = $injector.get('$httpBackend');
    }));

    afterEach(function() {
      window.sessionStorage.removeItem('/image.png');
      window.sessionStorage.removeItem('/image@2x.png');
      window.sessionStorage.removeItem('/picture.png');
      window.sessionStorage.removeItem('/picture@2x.png');
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('for static "ng-src" tags', function() {
      it('should set src tag with a highres image', inject(function($compile) {
        var element = angular.element('<img ng-src="/image.png">');
        $httpBackend.when('HEAD', '/image@2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image@2x.png');
      }));

      it('should set src directly if ng-src is a data-uri', inject(function($compile) {
        var element = angular.element('<img ng-src="data:image/png;base64,iVBOD">');
        $compile(element)(scope);
        scope.$apply();
        expect(element.attr('src')).toBe('data:image/png;base64,iVBOD');
      }));
    });

    describe('for marked up "ng-src" tags', function() {
      var element;

      beforeEach(inject(function($compile) {
        element = angular.element('<img ng-src="{{imageUrl}}">');
        scope.imageUrl = '/image.png';
        $httpBackend.when('HEAD', '/image@2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
      }));

      it('should copy content from "ng-src" to "src" tag', function() {
        expect(element.attr('src')).toBe('/image@2x.png');
      });

      describe('should observe scope.imageUrl', function() {
        beforeEach(function() {
          $httpBackend.when('HEAD', '/picture@2x.png').respond(200);
          scope.imageUrl = '/picture.png';
          scope.$digest();
          $httpBackend.flush();
        });

        it('and replace src tag with another picture', function() {
          expect(element.attr('src')).toBe('/picture@2x.png');
        });

        it('and check if the client side cache is working', function() {
          scope.imageUrl = '/image.png';
          scope.$digest();
          expect(element.attr('src')).toBe('/image@2x.png');
        });

        it('and should modify jpg', function() {
          $httpBackend.when('HEAD', '/image@2x.png').respond(200);
          $httpBackend.when('HEAD', '/image@2x.jpg').respond(200);
          $httpBackend.when('HEAD', '/image@2x.jpeg').respond(200);
          $httpBackend.when('HEAD', '/image@2x.gif').respond(200);
          $httpBackend.when('HEAD', '/image@2x.svg').respond(200);

          scope.imageUrl = '/image.png';
          scope.$digest();
          expect(element.attr('src')).toBe('/image@2x.png');

          scope.imageUrl = '/image.jpg';
          scope.$digest();
          $httpBackend.flush();
          expect(element.attr('src')).toBe('/image@2x.jpg');

          scope.imageUrl = '/image.jpeg';
          scope.$digest();
          $httpBackend.flush();
          expect(element.attr('src')).toBe('/image@2x.jpeg');

          scope.imageUrl = '/image.gif';
          scope.$digest();
          expect(element.attr('src')).toBe('/image.gif');

          scope.imageUrl = '/image.svg';
          scope.$digest();
          expect(element.attr('src')).toBe('/image.svg');
        })
      });
    });

    describe('for "ng-src" tags containing base64 encode URLs', function() {
      it('should not invoke any HEAD request', inject(function($compile) {
        var base64img = 'data:image/png;base64,' +
          'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGP' +
          'C/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YGARc5KB0XV+IA' +
          'AAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAF1J' +
          'REFUGNO9zL0NglAAxPEfdLTs4BZM4DIO4C7OwQg2JoQ9LE1exdlYvBBeZ7jq' +
          'ch9//q1uH4TLzw4d6+ErXMMcXuHWxId3KOETnnXXV6MJpcq2MLaI97CER3N0' +
          'vr4MkhoXe0rZigAAAABJRU5ErkJggg==';
        var element = angular.element('<img ng-src="' + base64img + '">');
        $compile(element)(scope);
        scope.$digest();
        expect(element.attr('src')).toBe(base64img);
      }));
    });

    describe('with alternative infix', function() {
      beforeEach(function() {
        retinaProvider.setInfix('_2x');
      });

      it('should set src tag with an alternative highres image', inject(function($compile) {
        var element = angular.element('<img ng-src="/image.png">');
        $httpBackend.when('HEAD', '/image_2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image_2x.png');
      }));

      afterEach(function() {
        retinaProvider.setInfix('@2x');
      });
    });

    describe('with the alternate high-resolution image is provided', function () {
      it('should set src tag with the alternate highres image', inject(function($compile) {
        var element = angular.element('<img ng-src="/image.png" data-at2x="/image-with-hash@2x.png">');
        $httpBackend.when('HEAD', '/image-with-hash@2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        expect(element.attr('src')).toBe('/image-with-hash@2x.png');
      }));
    });

    describe('with a query in the URL', function() {
      it('should apply the infix and preserve the query', inject(function($compile) {
        var element = angular.element('<img ng-src="/image.jpg?query=foo">');
        $httpBackend.when('HEAD', '/image@2x.jpg?query=foo').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image@2x.jpg?query=foo');
      }));
    });

    describe('if the high resolution image is not available', function() {
      beforeEach(function() {
        $httpBackend.when('HEAD', '/image@2x.png').respond(404);
      });

      it('should copy content from "ng-src" to "src" tag', inject(function($compile) {
        var element = angular.element('<img ng-src="/image.png">');
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image.png');
      }));

      it('should copy content from scope object to "src" tag', inject(function($compile) {
        var element = angular.element('<img ng-src="{{imageUrl}}">');
        scope.imageUrl = '/image.png';
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image.png');
      }));
    });
  });

  describe('on standard resolution displays using images in their low resolution version', function() {
    var scope;

    beforeEach(function() {
      module(function($provide) {
        $provide.provider('$window', function() {
          this.$get = function() {
            try {
              window.devicePixelRatio = 1;
            } catch (TypeError) {
              // in Firefox window.devicePixelRatio only has a getter
            }
            window.matchMedia = function(query) {
              return {matches: false};
            };
            return window;
          };
        });
      });
      module('ngRetina');
    });

    beforeEach(inject(function($rootScope) {
      scope = $rootScope.$new();
    }));

    it('should copy content from "ng-src" to "src" tag', inject(function($compile) {
      var element = angular.element('<img ng-src="/image.png">');
      $compile(element)(scope);
      scope.$digest();
      expect(element.attr('src')).toBe('/image.png');
    }));

    it('should copy content from scope object to "src" tag', inject(function($compile) {
      var element = angular.element('<img ng-src="{{imageUrl}}">');
      scope.imageUrl = '/image.png';
      $compile(element)(scope);
      scope.$digest();
      expect(element.attr('src')).toBe('/image.png');
    }));
  });
});
