var gulp          = require('gulp'),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglifyjs'),
    cssnano       = require('gulp-cssnano'),
    rename        = require('gulp-rename'),
    del           = require('del'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant'),
    cache         = require('gulp-cache'),
    autoprefixer  = require('gulp-autoprefixer'),
    pug           = require('gulp-pug'),
    path          = require('path'),
    getFileNames  = require('html2bl');

var params = [
    {
      out: 'app/source/sass',
      outSass: 'index.sass',
      htmlSrc: 'app/index.html',
      levels: ['app/source/common.blocks', 'app/source/index.blocks']
    },
    {
      out: 'app/source/sass',
      outSass: 'about.sass',
      htmlSrc: 'app/about.html',
      levels: ['app/source/common.blocks', 'app/source/about.blocks']
    }
  ]

  var getFN = []
  for (var i = 0; i < params.length; ++i) {
    getFN[i] = getFileNames.getFileNames(params[i]);
  }



gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
})

// gulp.task('watch', ['browser-sync', 'pug', 'sass', 'sass2'], function(){
//   gulp.watch('app/source/**/*.sass', ['sass'], browserSync.reload)
//   gulp.watch('app/source/**/*.pug', ['pug', 'sass', 'sass2'], browserSync.reload)
//
// })
gulp.task('watch', ['browser-sync', 'pug', 'tada'], function(){
  gulp.watch('app/source/**/*.sass', ['tada'], browserSync.reload)
  gulp.watch('app/source/**/*.pug', ['pug', 'tada'], browserSync.reload)

})

gulp.task('pug',  function() {
    gulp.src(['app/source/**/*.pug', '!app/source/includes/*.pug'])
      .pipe( pug({pretty: true}) )
      .pipe( gulp.dest('app') )
      .pipe(browserSync.reload({stream:true}))
});

var crdTasks = [];

function createTask(key){

  getFN[key] = getFileNames.getFileNames(params[key]);
  getFN[key].then(function(src){
    return src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.sass';
      return jsGlob;

    });
  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat(params[key].outSass))
      .pipe(gulp.dest(params[key].out))
      .pipe(sass())
      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({stream:true}))
  })
  .done();

}


gulp.task('tada', function(){
  for (var i = 0; i < params.length; i++){
    createTask(i);
    crdTasks.push(i);
  }
})



// gulp.task('sass', function() {
//       getFN[0] = getFileNames.getFileNames(params[0]);
//       getFN[0].then(function(src){
//         return src.dirs.map(function(dirName){
//           var jsGlob = path.resolve(dirName) + '/*.sass';
//           return jsGlob;
//
//         });
//       })
//       .then(function(jsGlobs){
//         gulp.src(jsGlobs)
//           .pipe(concat(params[0].outSass))
//           .pipe(gulp.dest(params[0].out))
//           .pipe(sass())
//           .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//           .pipe(gulp.dest('app/css'))
//           .pipe(browserSync.reload({stream:true}))
//       })
//       .done();
//
// });
//
//
// gulp.task('sass2', function() {
//       getFN[1] = getFileNames.getFileNames(params[1]);
//       getFN[1].then(function(src){
//         return src.dirs.map(function(dirName){
//           var jsGlob = path.resolve(dirName) + '/*.sass';
//           return jsGlob;
//         });
//       })
//       .then(function(jsGlobs){
//         gulp.src(jsGlobs)
//           .pipe(concat(params[1].outSass))
//           .pipe(gulp.dest(params[1].out))
//           .pipe(sass())
//           .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//           .pipe(gulp.dest('app/css'))
//           .pipe(browserSync.reload({stream:true}))
//       })
//       .done();
// });
