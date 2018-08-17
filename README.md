# angular-retina

Replaces the AngularJS directive ```ng-src``` by a version which supports Retina displays.

If the browser runs on a Retina display and the referenced image is available in double
resolution, then load the high resolution version of that image from the server.

[![Build Status](https://travis-ci.org/jrief/angular-retina.png)](https://travis-ci.org/jrief/angular-retina)
[![Code Climate](https://codeclimate.com/github/jrief/angular-retina/badges/gpa.svg)](https://codeclimate.com/github/jrief/angular-retina)

## Install
If you prefer to host Javascript files locally instead of using a CDN, install them with:

```npm install angular-retina```

[min]: https://raw.github.com/jrief/angular-retina/master/dist/angular-retina.min.js
[max]: https://raw.github.com/jrief/angular-retina/master/dist/angular-retina.js

## Client usage
Into the main HTML code, add the required URLs from the CDN or include the files locally:

```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.9/angular.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/angular-retina/0.3.1/angular-retina.min.js"></script>
```
Please note, that *angular-retina* requires ```angularjs-1.2.1``` or later.

In Javascript, initialize the main module for your AngularJS application:

```javascript
var my_app = angular.module('MyApp', [...other dependencies..., 'ngRetina']);
```

In the body of any HTML code, access static referenced images using:

```html
<img ng-src="/path/to/image.png" width="100" height="100">
```

or reference the image using AngularJS's markup:

```html
<img ng-src="{{ image_url }}" width="100" height="100">
```

Note that when using this module, adding the element attributes ```width="..."```
and/or ```height="..."``` becomes mandatory, as the displayed image
otherwise gets scaled to its double size.

Just use it in your HTML-code as you would use the common AngularJS directive
[ngSrc](http://docs.angularjs.org/api/ng.directive:ngSrc):

## Alternative infix
When this library was written, Apple Inc. recommended to use ```@2x``` as infix, for images
optimized for Retina displays. In late 2013, they changed their mind, and now
[suggest to use the infix](https://developer.apple.com/library/safari/documentation/NetworkingInternet/Conceptual/SafariImageDeliveryBestPractices/ServingImagestoRetinaDisplays/ServingImagestoRetinaDisplays.html) ```_2x```.

Since Apple's former recommendation, the proposed infix has been hard coded into some server-side
libraries for image generation. Therefore, in version 0.3.0 of *angular-retina*, a configuration function
has been added, which shall be used to set the infix to the newly proposed ```_2x``` – but of course
only, if the server-side also supports it!

```javascript
my_app.config(function(ngRetinaProvider) {
    ngRetinaProvider.setInfix('_2x');
});
```

## Hide images until loaded, avoiding "broken image" display
To hide (`opacity: 0`) images until the library has determined what resolution to use, set the `src` and the image has finished downloading, use the following config:

```javascript
my_app.config(function(ngRetinaProvider) {
    ngRetinaProvider.setFadeInWhenLoaded(true);
});
```

## Images with embedded hash

When using a framework that embeds a digest/hash to the asset URL, the problem
is that a high-resolution verison would have a different hash and would not follow the
usual pattern that ends with @2x. Instead the hash is added at the end, i.e.
`/images/image@2x-{hash2}.jpg`, so the automatic detection of image URL would fail.

The solution is to supply the high-resolution URL image from the outside of the library
using the `data-at2x` attribute:

```html
<img src="/images/image.jpg" data-at2x="/images/image@2x.jpg" />
```

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

## Same Origin Policy
In order to verify if the image exists in high resolution, *angular-retina* invokes
a HEAD request with the URL of the high-res image.

For security reasons, Javascript may not access files on servers starting with a
different domain name. This is known as the
[Same Origin Policy](http://www.w3.org/Security/wiki/Same_Origin_Policy).
Therefore please ensure, that all images accessed through ```ng-src``` can be loaded
from the same domain as the main HTML file.

## Release History
+ 0.1.0 - initial revision.
+ 0.1.3 - fixed problems with minified JS code.
+ 0.2.0 - using sessionStorage instead of $cacheFactory to boost performance.
+ 0.3.0 - added ```setInfix``` to configure the used infix for Retina images.
+ 0.3.1 - added a noretina attribute support to conditionally disable the "retinification" for an element.

## License
&copy; 2015 Jacob Rief

MIT licensed.
