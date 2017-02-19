var gulp = require('gulp');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');

var paths = {
  normalize: 'node_modules/normalize.css/normalize.css',
  jq: 'node_modules/jquery/dist/jquery.min.js',
  styles: './app/styles/**/*.less',
  stylesVendors: './app/styles/vendor/@(*.less|*.css)',
  mainLess: './app/styles/main.less',
  jade: './app/jade/**/*.jade',
  js: './app/js/**/*.js',
  jsVendors: './app/js/vendor/*.js',
  prod: './app/prod/'
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
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(paths.prod + 'css/'))
});

gulp.task('js', function() {
  gulp.src([paths.js, '!'.concat(paths.jsVendors)])
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.prod + 'js/'));
});

gulp.task('server', function() {
  browserSync({
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
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('build', function() {
  gulp.src(paths.normalize)
    .pipe(gulp.dest(paths.prod + 'css/'));
  gulp.src(paths.jq)
    .pipe(gulp.dest(paths.prod + 'js/vendor/'));
  gulp.src('./app/assets/**/*.svg')
    .pipe(gulp.dest(paths.prod + 'assets/'));
  gulp.src(paths.jsVendors)
    .pipe(gulp.dest(paths.prod + 'js/vendor'));
  gulp.src(paths.stylesVendors)
    .pipe(gulp.dest(paths.prod + 'css/vendor'));
  gulp.start('jade');
  gulp.start('less');
  gulp.start('js');
});

gulp.task('clean', function() {
  del.sync(['./app/prod/**', '!./app/prod']);
});

gulp.task('default', ['build', 'server', 'watch']);