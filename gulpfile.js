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



var params_1 = {
    out: 'app',
    htmlSrc: 'app/index.html',
    levels: ['app/source/common.blocks', 'app/source/index.blocks']
  },
    params_2 = {
    out: 'app',
    htmlSrc: 'app/about.html',
    levels: ['app/source/common.blocks', 'app/source/about.blocks']
  },
  getFileNames_1 = getFileNames.getFileNames(params_1),
  getFileNames_2 = getFileNames.getFileNames(params_2);



gulp.task('pug', function() {
  return  gulp.src(['app/source/**/*.pug', '!app/source/includes/*.pug'])
    .pipe( pug({pretty: true}) )
    .pipe( gulp.dest('app') )
    .pipe(browserSync.reload({stream:true}))

});



//pages
//index
gulp.task('sass_index', ['pug'], function(){
  getFileNames_1.then(function(src){
    return src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.sass';
      return jsGlob;
    });
  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat('source/sass/index.sass'))
      .pipe(gulp.dest(params_1.out))
      .pipe(browserSync.reload({stream:true}))
  })
  .done();
})


gulp.task('js_index', function(){
  getFileNames_1.then(function(src){
    return src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.js';
      return jsGlob;
    });
  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat('js/index.js'))
      .pipe(gulp.dest(params_1.out))
      .pipe(browserSync.reload({stream:true}))
  })

  .done();
})

gulp.task('img_index', function(){
  getFileNames_1.then(function(source){
    gulp.src(source.dirs.map(function(dir){
      var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
      return imgGlob;
    }))
    .pipe(gulp.dest(path.join(params_1.out, 'img')));
  })
  .done();
})
// END index

//about
gulp.task('sass_about', function(){
  getFileNames_2.then(function(src){
    return src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.sass';
      return jsGlob;
    });
  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat('source/sass/about.sass'))
      .pipe(gulp.dest(params_2.out))
      .pipe(browserSync.reload({stream:true}))
  })
  .done();
})


gulp.task('js_about', function(){
  getFileNames_2.then(function(src){
    return src.dirs.map(function(dirName){
      var jsGlob = path.resolve(dirName) + '/*.js';
      return jsGlob;
    });
  })
  .then(function(jsGlobs){
    gulp.src(jsGlobs)
      .pipe(concat('js/about.js'))
      .pipe(gulp.dest(params_2.out))
      .pipe(browserSync.reload({stream:true}))
  })
  .done();
})
gulp.task('img_about', function(){
  getFileNames_2.then(function(source){
    gulp.src(source.dirs.map(function(dir){
      var imgGlob = path.resolve(dir) + '/*.{jpg,png,svg}';
      return imgGlob;
    }))
    .pipe(gulp.dest(path.join(params_2.out, 'img')));
  })
  .done();
})
// END about


gulp.task('sass', function(){
  gulp.src('app/source/sass/**/*.sass')
  .pipe(sass())
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream:true}))
})


gulp.task('scripts', function(){
  return gulp.src('app/libs/jquery/dist/jquery.min.js')
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
})

gulp.task('css-libs', function(){
  return gulp.src('app/css/libs.css')
  .pipe(cssnano())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('app/css'));
})

gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
})

gulp.task('clean', function(){
  return del.sync('dist');
})

gulp.task('clear', function(){
  return cache.clearAll();
})

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

gulp.task('watch', ['browser-sync', 'css-libs', 'pug', 'scripts', 'js_index', 'js_about', 'sass_index', 'sass_about', 'sass'], function(){
  gulp.watch('app/source/**/*.sass', ['sass_index', 'sass_about', 'sass']);
  gulp.watch('app/source/**/*.pug', ['pug'], browserSync.reload)
  gulp.watch('app/source/**/**/*.js', ['js_index', 'js_about'], browserSync.reload)
})

gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
  var buildCss = gulp.src([
    'app/css/main.css',
    'app/css/libs.min.css',
  ])
    .pipe(gulp.dest('dist/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));

  var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
})
