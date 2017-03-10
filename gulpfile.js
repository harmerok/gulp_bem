var gulp          = require('gulp'),
    styl          = require('gulp-stylus'),
    pug           = require('gulp-pug'),
    cache         = require('gulp-cache'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglifyjs'),
    browserSync   = require('browser-sync'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    del           = require('del'),
    path          = require('path'),
    getFileNames  = require('html2bl');

var params = [
    {
      out: 'app/source/styl',                                           //directory for gathered stylus file
      outStyl: 'index.styl',                                            //gathered stylus file for page x, ready for compile
      outJs: 'index.js',                                                //gatherd js file file for page x
      htmlSrc: 'app/index.html',                                        //src for gathering classes from compiled page x)
      levels: ['app/source/common.blocks', 'app/source/index.blocks']   //redefining levels for gathering blocks
    },
    {
      out: 'app/source/styl',
      outStyl: 'about.styl',
      outJs: 'about.js',
      htmlSrc: 'app/about.html',
      levels: ['app/source/common.blocks', 'app/source/about.blocks']
    }
  ]

var getFN = []
for (var i = 0; i < params.length; ++i) {
  getFN[i] = getFileNames.getFileNames(params[i]);
}
// service file for styl vars
var serviceStyl = 'app/source/styl/service.styl';

gulp.task('default', ['watch']);

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
})

gulp.task('watch', ['browser-sync', 'pug', 'libs', 'loopStyl', 'loopJs', 'loopImg'], function(){
  gulp.watch('app/source/**/*.pug', ['pug', 'loopStyl', 'loopJs', 'loopImg'], browserSync.reload)
  gulp.watch('app/source/**/*.styl', ['loopStyl'], browserSync.reload)
  gulp.watch('app/source/**/*.js', ['loopJs'], browserSync.reload)

})

gulp.task('pug',  function() {
    gulp.src(['app/source/**/*.pug', '!app/source/includes/*.pug'])
      .pipe( pug({pretty: true}) )
      .pipe( gulp.dest('app') )
      .pipe(browserSync.reload({stream:true}))
});

//Function for creating task: Collecting styl on levels and generation css for each page
function createTaskStyl(key){

  getFN[key] = getFileNames.getFileNames(params[key]);
  getFN[key].then(function(src){
    var serv = [path.resolve(serviceStyl)]
    var dirsBlocks = src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.styl';
      return jsGlob;
    })

    return serv.concat(dirsBlocks)

  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat(params[key].outStyl))
      .pipe(gulp.dest(params[key].out))
      .pipe(styl())
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({stream:true}))
  })

  .done();
}


//Function for creating task: Collecting js on levels for each page
function createTaskJs(key){

  getFN[key] = getFileNames.getFileNames(params[key]);
  getFN[key].then(function(src){
    return src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.js';
      return jsGlob;

    });
  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat(params[key].outJs))
      .pipe(gulp.dest('app/js'))
      .pipe(browserSync.reload({stream:true}))
  })
  .done();

}

//Function for creating task: Collecting img on levels for each page
function createTaskImg(key){

  getFN[key] = getFileNames.getFileNames(params[key]);
  getFN[key].then(function(src){

    gulp.src(src.dirs.map(function(dir){
      var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
      return imgGlob;
    }))
    .pipe( gulp.dest('app/img') );
  })
  .done();
}

//Creating multiple tasks
gulp.task('loopImg', function(){
  for (var i = 0; i < params.length; i++){
    createTaskImg(i);
  }
})

gulp.task('loopStyl', function(){
  for (var i = 0; i < params.length; i++){
    createTaskStyl(i);
  }
})

gulp.task('loopJs', function(){
  for (var i = 0; i < params.length; i++){
    createTaskJs(i);
  }
})

//Js libs optimization
gulp.task('libs', function(){
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js/libs'))
})

//Img optimization
gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    une: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'))
})



//Build dist
gulp.task('build', ['clean', 'img'], function(){
  var buildCss = gulp.src('app/css/**/*')
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
})

//Delete dist
gulp.task('clean', function(){
  return del.sync('dist');
})

//Clear cache
gulp.task('clear', function(){
  return cache.clearAll();
})
