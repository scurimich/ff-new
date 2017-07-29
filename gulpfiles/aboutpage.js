var gulp = require('gulp');
var less = require('gulp-less');
var cleanCss = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');


gulp.task('aboutLess', function() {
  gulp.src('./app/styles/about.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 5%']
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.prod + 'css/'))
});

gulp.task('aboutJs', function() {
  gulp.src('./app/js/about.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(gulp.dest(paths.prod + 'js/'));
});