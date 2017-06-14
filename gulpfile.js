var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var deploy = require('gulp-gh-pages');

var sprites = require('./gulpfiles/sprites.js');


var paths = {
  styles: './app/styles/**/*.less',
  mainLess: './app/styles/*.less',
  jade: ['./app/jade/**/*.jade', '!./app/jade/organisms/*', '!./app/jade/_common/*', '!./app/jade/atoms/*', '!./app/jade/molecules/*', '!./app/jade/templates/*'],
  jadeWatch: './app/jade/**/*.jade',
  js: './app/js/**/*.js',
  jsVendors: './app/js/vendor/*.js',
  fonts: './app/fonts/*',
  img: './app/assets/**/*',
  prod: 'app/prod/',
  watch: {
    jade: './app/jade/**/*.jade'
  }
};


gulp.task('jade', function() {
  var locals = {};
  gulp.src(paths.jade)
    .pipe(plumber())
    .pipe(jade({
      pretty: '\t',
      locals: locals
    }))
    .pipe(gulp.dest(paths.prod));
});


gulp.task('less', function() {
  gulp.src(paths.mainLess)
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 5%']
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.prod + 'css/'))
});


gulp.task('js', function() {
  gulp.src([paths.js, '!'.concat(paths.jsVendors)])
    .pipe(plumber())
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.prod + 'js/'));
});


gulp.task('server', function() {
  return browserSync({
    port: 9001,
    server: {
      baseDir: paths.prod
    }
  });
});


gulp.task('watch', function() {
  gulp.watch([
    paths.prod + '/**/*.html',
    paths.prod + '/**/*.js',
    paths.prod + '/**/*.css'
  ]).on('change', browserSync.reload);
  watch(paths.styles, function() {
    gulp.start('less');
  });
  watch(paths.watch.jade, function() {
    gulp.start('jade');
  });
  watch(paths.js, function() {
    gulp.start('js');
  });
  watch(paths.img, function() {
    gulp.start('build');
  });
});


gulp.task('build', function() {
  gulp.src('./app/assets/**/*.svg')
    .pipe(gulp.dest(paths.prod + 'assets/'));

  gulp.src('./app/img/**/*')
    .pipe(gulp.dest(paths.prod + 'img/'));

  gulp.src(paths.jsVendors)
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.prod + 'js/vendor'));

  gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.prod + 'fonts/'));

  gulp.start('jade');
  gulp.start('less');
  gulp.start('js');
});


gulp.task('clear', function() {
  del.sync('./app/prod/**');
});


gulp.task('deploy', ['build'], function() {
  return gulp.src('./app/prod/**/*')
    .pipe(deploy({
      branch: 'gh-pages',
      push: true
    }));
});


gulp.task('default', ['build', 'server', 'watch']);