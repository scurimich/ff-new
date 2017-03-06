var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var del = require('del');
var deploy = require('gulp-gh-pages');

var paths = {
  normalize: 'node_modules/normalize.css/normalize.css',
  rateit: 'node_modules/jquery.rateit/scripts/@(jquery.rateit.min.js|rateit.css|star.gif|delete.gif)',
  jq: 'node_modules/jquery/dist/jquery.min.js',
  styles: './app/styles/**/*.less',
  stylesVendors: './app/styles/vendor/@(*.less|*.css)',
  mainLess: './app/styles/*.less',
  jade: ['./app/jade/**/*.jade', '!./app/jade/templates/*'],
  js: './app/js/**/*.js',
  jsVendors: './app/js/vendor/*.js',
  fonts: './app/fonts/*',
  img: './app/assets/**/*',
  prod: 'app/prod/'
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
  return browserSync({
    port: 9000,
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
  watch(paths.jade, function() {
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
  gulp.src(paths.normalize)
    .pipe(gulp.dest(paths.prod + 'css/vendor/'));
  gulp.src(paths.rateit)
    .pipe(gulp.dest(paths.prod + 'js/vendor/'));
  gulp.src(paths.jq)
    .pipe(gulp.dest(paths.prod + 'js/vendor/'));
  gulp.src('./app/assets/**/*')
    .pipe(gulp.dest(paths.prod + 'assets/'));
  gulp.src(paths.jsVendors)
    .pipe(gulp.dest(paths.prod + 'js/vendor'));
  gulp.src(paths.stylesVendors)
    .pipe(gulp.dest(paths.prod + 'css/vendor'));
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
})

gulp.task('default', ['build', 'server', 'watch']);