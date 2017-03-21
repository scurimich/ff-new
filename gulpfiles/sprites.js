var gulp = require('gulp');
var plumber = require('gulp-plumber');
var svgSprite = require('gulp-svg-sprites');
var spritesmith = require('gulp.spritesmith');


gulp.task('png-sprites', function() {

  gulp.src('./app/assets/categories-*/*.png')
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'img/categories.png',
      cssName: 'styles/sprites/categories-sprite.less',
      padding: 10
    }))
    .pipe(gulp.dest('./app/'));

  gulp.src('./app/assets/socials/*.png')
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'img/socials.png',
      cssName: 'styles/sprites/socials-sprite.less',
      padding: 10
    }))
    .pipe(gulp.dest('./app/'));

  gulp.src('./app/assets/avatars/*.png')
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'img/avatars.png',
      cssName: 'styles/sprites/avatars-sprite.less',
      padding:10
    }))
    .pipe(gulp.dest('./app/'));

});

gulp.task('svg-sprites', function() {

  gulp.src('./app/assets/*.svg')
    .pipe(plumber());

});