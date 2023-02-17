const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');

function browsersync() {
  browserSync.init({
    server: 'src/',
    notify: false,
  });
}

const config = {
  mode: {
    css: {
      render: {
        css: true,
      },
    },
  },
};

function buildSvg() {
  return src('src/assets/img/icons/*.svg').pipe(svgSprite(config)).pipe(dest('dist/assets/img/icons')).pipe(dest('src/assets/img/icons'));
}

function buildSass() {
  return src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(sourcemaps.write('.'))
    .pipe(dest('src/styles'))
    .pipe(dest('dist/styles'))
    .pipe(browserSync.stream());
}

function html() {
  return src('src/**/*.html').pipe(dest('dist/')).pipe(browserSync.stream());
}

function serve() {
  watch('src/**/*.scss', buildSass);
  watch('src/**/*.html', html);
}

function copyimg() {
  return src('src/img/**/*.*').pipe(dest('dist/img/'));
}

function cleanDist() {
  return del('dist/**/*', { force: true });
}

exports.clean = series(cleanDist);
exports.build = series(cleanDist, buildSvg, buildSass, html, copyimg);
exports.default = series([buildSvg, buildSass], parallel(browsersync, serve));
