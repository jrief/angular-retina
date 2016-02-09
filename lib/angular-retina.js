// Add support for Retina displays when using element attribute "ng-src".
// This module overrides the built-in directive "ng-src" with one which
// distinguishes between standard or high-resolution (Retina) displays.

(function(angular, undefined) {
  'use strict';
  var infix = '@2x',
    dataUrlRegex = /^data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
    allowedImageTypesRegex = /(png|jp[e]?g)$/,
    fadeInWhenLoaded = false,
    loadErrorHandler = angular.noop;

  var ngRetina = angular.module('ngRetina', []).config(['$provide', function($provide) {
    $provide.decorator('ngSrcDirective', ['$delegate', function($delegate) {
      $delegate[0].compile = function(element, attrs) {
        // intentionally empty to override the built-in directive ng-src
      };
      return $delegate;
    }]);
  }]);

  ngRetina.provider('ngRetina', function() {
    this.setInfix = function setInfix(value) {
      infix = value;
    };

    this.setFadeInWhenLoaded = function setFadeInWhenLoaded(value) {
      fadeInWhenLoaded = value;
    };

    this.setLoadErrorHandler = function setLoadErrorHandler(handler) {
      loadErrorHandler = handler;
    };

    this.$get = angular.noop;
  });

  ngRetina.directive('ngSrc', ['$window', '$http', function($window, $http) {
    var msie = parseInt(((/msie (\d+)/.exec($window.navigator.userAgent.toLowerCase()) || [])[1]), 10);
    var isRetina = ((function() {
      var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), ' +
        '(-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
      if ($window.devicePixelRatio > 1) {
        return true;
      }
      return $window.matchMedia && $window.matchMedia(mediaQuery).matches;
    })());

    function getHighResolutionURL(url) {
      var parts = url.split('.');
      if (parts.length < 2) {
        return url;
      }
      parts[parts.length - 2] += infix;
      return parts.join('.');
    }

    return function(scope, element, attrs) {
      function setImgSrc(imageUrl) {
        element.on('error', loadErrorHandler);

        attrs.$set('src', imageUrl);
        if (msie) {
          element.prop('src', imageUrl);
        }
      }

      function set2xVariant(imageUrl) {
        var imageUrl2x;
        if (angular.isUndefined(attrs.at2x)) {
          imageUrl2x = $window.sessionStorage.getItem(imageUrl);
        } else {
          imageUrl2x = attrs.at2x;
        }
        if (!imageUrl2x) {
          imageUrl2x = getHighResolutionURL(imageUrl);
          $http.head(imageUrl2x).
            success(function(data, status) {
            setImgSrc(imageUrl2x);
            $window.sessionStorage.setItem(imageUrl, imageUrl2x);
          })
          .error(function(data, status, headers, config) {
            setImgSrc(imageUrl);
            $window.sessionStorage.setItem(imageUrl, imageUrl);
          });
        } else {
          setImgSrc(imageUrl2x);
        }
      }

      attrs.$observe('ngSrc', function(imageUrl, oldValue) {
        if (!imageUrl) {
          return;
        }

        if (fadeInWhenLoaded && !$window.sessionStorage.getItem('fadedIn-' + imageUrl)) {
          element.css({
            opacity: 0,
            '-o-transition': 'opacity 0.5s ease-out',
            '-moz-transition': 'opacity 0.5s ease-out',
            '-webkit-transition': 'opacity 0.5s ease-out',
            'transition': 'opacity 0.5s ease-out'
          });
          element.on('load', function() {
            $window.sessionStorage.setItem('fadedIn-' + imageUrl, true);
            element.css('opacity', 1);
          });
        }

        if (isRetina &&
            angular.isUndefined(attrs.noretina) &&
            typeof $window.sessionStorage === 'object' &&
            element[0].tagName === 'IMG' &&
            imageUrl.match(allowedImageTypesRegex) &&
            !imageUrl.match(dataUrlRegex)) {
            set2xVariant(imageUrl);
          } else {
            setImgSrc(imageUrl);
          }
      });
    };
  }]);
})(window.angular);
