var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');

gulp.task('fonts', function() {
  gulp.src('./app/styles/common/fonts.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['> 5%']
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('./app/prod/css/'));
});