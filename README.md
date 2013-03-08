# angular-retina

Replace AngularJS directive 'ng-src' by a version which supports Retina displays

## Quick start
### Download

[min]: https://raw.github.com/jrief/angular-retina/master/dist/angular-retina.min.js
[max]: https://raw.github.com/jrief/angular-retina/master/dist/angular-retina.js

+ Into your html include the required libraries:

>
``` html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.1.3/angular.min.js"></script>
<script src="/path/to/your/javascript-files/angular-retina.min.js"></script>
```

### On the client

+ in your main JavaScript file:
>
```javascript
angular.module('MyAwesomeModule', [...other dependencies..., 'ngRetina']);
```

+ in HTML files to access static referenced images:
>
```html
<img ng-src="/path/to/any/image.png" width="100" height="100">
```

+ or images with markups:
>
```html
<img ng-src="{{image_url}}" width="100" height="100">
```

use it in your HTML-code as you would use the common Angular directive
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
This module also rewrites ```<img ng-src="...">``` tags, which contain a static
image url, ie. one without any mark-up directives.

Note that when using this module, adding the element attributes ```width="..."```
and ```height="..."``` becomes mandatory, as the displayed high-resolution image
otherwise gets scaled to the double size.

## Release History
0.1.0 - initial revision

## License
Copyright (c) 2013 Jacob Rief  
Licensed under the MIT license.
