const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

function browsersync() {
  browserSync.init({
    server: 'src/',
    notify: false,
  });
}

function buildSass() {
  return src('src/styles/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(dest('src/styles'))
    .pipe(dest('dist/styles'))
    .pipe(sourcemaps.write('.'))
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
exports.build = series(cleanDist, buildSass, html, copyimg);
exports.default = series(buildSass, parallel(browsersync, serve));
