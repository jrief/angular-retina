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
      module('ngRetina');
    });

    beforeEach(module(function(ngRetinaProvider) {
      retinaProvider = ngRetinaProvider;
    }));

    beforeEach(inject(function($injector, $rootScope) {
      scope = $rootScope.$new();
      $httpBackend = $injector.get('$httpBackend');
    }));

    afterEach(function() {
        window.sessionStorage.removeItem("/image.png");
        window.sessionStorage.removeItem("/picture.png");
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
    });

    describe('for marked up "ng-src" tags', function() {
      var element;

      beforeEach(inject(function($compile) {
        element = angular.element('<img ng-src="{{image_url}}">');
        scope.image_url = '/image.png';
        $httpBackend.when('HEAD', '/image@2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
      }));

      it('should copy content from "ng-src" to "src" tag', function() {
        expect(element.attr('src')).toBe('/image@2x.png');
      });

      describe('should observe scope.image_url', function() {
        beforeEach(function() {
          $httpBackend.when('HEAD', '/picture@2x.png').respond(200);
          scope.image_url = '/picture.png';
          scope.$digest();
          $httpBackend.flush();
        });

        it('and replace src tag with another picture', function() {
          expect(element.attr('src')).toBe('/picture@2x.png');
        });

        it('and check if the client side cache is working', function() {
          scope.image_url = '/image.png';
          scope.$digest();
          expect(element.attr('src')).toBe('/image@2x.png');
        });
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
        var element = angular.element('<img ng-src="{{image_url}}">');
        scope.image_url = '/image.png';
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
      var element = angular.element('<img ng-src="{{image_url}}">');
      scope.image_url = '/image.png';
      $compile(element)(scope);
      scope.$digest();
      expect(element.attr('src')).toBe('/image.png');
    }));
  });

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
    })
  });

});
