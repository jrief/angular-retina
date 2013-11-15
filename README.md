# angular-retina

Replaces the AngularJS directive ```ng-src``` by a version which supports Retina displays.

If the browser runs on a Retina display and the referenced image is available in double
resolution, then load the high resolution version of that image from the server.

[![Build Status](https://travis-ci.org/jrief/angular-retina.png)](https://travis-ci.org/jrief/angular-retina)

## Quick start
### Download

```npm install angular-retina```

[min]: https://raw.github.com/jrief/angular-retina/master/dist/angular-retina.min.js
[max]: https://raw.github.com/jrief/angular-retina/master/dist/angular-retina.js

### On the client
+ Into your HTML code include the required libraries:

>
```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.0/angular.min.js"></script>
<script src="/path/to/your/javascript-files/angular-retina.min.js"></script>
```

Please note, that *angular-retina* requires ```angularjs-1.1.3``` or later.

+ and in your main JavaScript file:

>
```javascript
angular.module('MyAwesomeModule', [...other dependencies..., 'ngRetina']);
```

+ in the body of your HTML, access static referenced images using:

>
```html
<img ng-src="/path/to/image.png" width="100" height="100">
```

+ or reference the image using a markup:

>
```html
<img ng-src="{{image_url}}" width="100" height="100">
```

Just use it in your HTML-code as you would use the common AngularJS directive
[ngSrc](http://docs.angularjs.org/api/ng.directive:ngSrc):

## On the server
Applications supporting Retina displays should include two separate files for
each image resource. One file provides a standard-resolution version of a given
image, and the second provides a high-resolution version of the same image.
The naming conventions for each pair of image files is as follows:
+ Standard: ```<image_name>.<filename_extension>```
+ High resolution: ```<image_name>@2x.<filename_extension>```

If the browser runs on a high-resolution display, and if the referenced image
is available in high-resolution, the corresponding ```<img ng-src="...">``` tag
is interpreted, such that the image in high-resolution is referenced.

This module can also be used to reference static image urls, to load the
high resolution version on Retina displays.

Note that when using this module, adding the element attributes ```width="..."```
and/or ```height="..."``` becomes mandatory, as the displayed image
otherwise gets scaled to its double size.

## Release History
+ 0.1.0 - initial revision
+ 0.1.3 - fixed problems with minified JS code
+ 0.2.0 - using sessionStorage instead of $cacheFactory to boost performance

## License
Copyright (c) 2013 Jacob Rief  
Licensed under the MIT license.
