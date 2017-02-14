# gulp_bem_template_1.0.0b
####The template is at a testing stage.
##Overview
The template is based on **BEM methodology**. It can be used for multiple pages with their individual parameters.

After putting the html code of the block on the page, css and JS will be collected automatically from the block folders into this page's css file, and the images will be moved to the folder with  main images from the block folder
###Gathering classes
<a href="https://github.com/dab/html2bl">html2bl</a> was used to gather classes.
It was forked, and then the **_"classes=[]"_** was added in order to gather classes for multiple pages separately:

_exports.getFileNames = function(params) {**classes= []**...};_

##Tools: 
gulp/pug/sass

##Features:

1. Automatic gathering of css, js, images from independent blocks for each page separately
2. Some parameters for each page, can be changed in the _"params[]"_;
3. The livereload is based on <a href="https://github.com/BrowserSync/browser-sync">BrowserSync</a>

###Option features:

1. Image optimization
2. Сoncatenation and minification of Js libs

