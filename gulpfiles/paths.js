module.exports = {
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