const { src, dest, watch, series, parallel } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const tinypng = require('gulp-tinypng-unlimited')
const del = require('del')
const posthtml = require('gulp-posthtml')
const include = require('posthtml-include')
const ttf2woff2 = require('gulp-ttf2woff2')

const serve = () => {
  browserSync.init({
    server: {
      baseDir: "dist/"
    }
  })
}

const clean = () => {
  return del('dist')
}

const html = () => {
  return src('src/**/*.html')
    .pipe(posthtml([
      include({
        root: './src'
      })
    ]))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const css = () => {
  const plugins = [
    autoprefixer({
      cascase: false
    }),
    cssnano()
  ]
  return src('src/scss/*.scss')
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}
  
const js = () => {
  return src('src/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}
  
const img = () => {
  return src('src/img/**/*')
    .pipe(tinypng())
    .pipe(dest('dist/img'))
    .pipe(browserSync.stream())
}

const ico = () => {
  return src('src/*.ico')
    .pipe(dest('dist'))
}

const fonts = () => {
  return src('src/fonts/**/*')
    .pipe(ttf2woff2())
    .pipe(dest('dist/fonts'))
}

const watchTask = () => {
  serve()
  watch('src/**/*.html', html).on('change', browserSync.reload)
  watch(['src/scss/**/*.scss', 'src/sass/**/*.sass'], css)
  watch('src/**/*.js', js)
  watch(['src/img/**/*', 'src/images/**/*'], img)
  watch('src/*.ico', ico)
  watch('src/fonts/**/*', ico)
}

exports.clean = clean
exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.ico = ico
exports.fonts = fonts
exports.watch = watch

exports.build = series(clean, parallel(html, css, js, img, ico, fonts))
exports.default = series(clean, parallel(html, css, js, img, ico, fonts), watchTask)
