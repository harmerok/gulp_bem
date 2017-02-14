# gulp_bem_template_1.0.0b
####Template is on stage of testing.
##Overview
Template based on **BEM methodology** (dividing the user interface into independent blocks).

After putting the html code of the block on the page, css and JS will be collected automatically from the block folders into this page's css file, and the images will be moved to the folder with  main images from the block folder
###Gathering classes
<a href="https://github.com/dab/html2bl">html2bl</a> was used  for gathering classes.
It was forked, and there **was added  _"classes=[]"_** for gathering classes for multiple pages separately:

_exports.getFileNames = function(params) {**classes= []**...};_

##Tools: 
gulp/pug/sass

##Features:

1. Automatic gathering of css, js, images from independent blocks for each page separately
2. Some params for each page, can be changed in _"params[]"_;
3. Livereload based on <a href="https://github.com/BrowserSync/browser-sync">BrowserSync</a>

###Option features:

1. Images optimization
2. Js libs concatination and minification

