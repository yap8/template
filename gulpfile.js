const gulp = require('gulp')
const sass = require('gulp-sass')
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

// Development
const html = () => {
  return gulp.src('src/**/*.html')
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
}

const css = () => {
  const plugins = [
    autoprefixer({
      cascase: false
    }),
    cssnano()
  ]
	return gulp.src('src/scss/*.scss')
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream())
  }
  
const js = () => {
	return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
  }
  
const img = () => {
  return gulp.src(['src/img/**/*!svg', 'src/images/**/*!svg'])
    .pipe(tinypng())
    .pipe(gulp.dest('dist'))
		.pipe(browserSync.stream())
}

const ico = () => {
  return gulp.src('src/*.ico')
    .pipe(gulp.dest('dist'))
}

const fonts = () => {
  return gulp.src('src/fonts/**/*')
    .pipe(ttf2woff2())
		.pipe(gulp.dest('dist/fonts'))
}

const watch = () => {
	serve()
	gulp.watch('src/**/*.html', html).on('change', browserSync.reload)
	gulp.watch(['src/scss/**/*.scss', 'src/sass/**/*.sass'], css)
	gulp.watch('src/**/*.js', js)
	gulp.watch(['src/img/**/*', 'src/images/**/*'], img)
	gulp.watch('src/*.ico', ico)
	gulp.watch('src/fonts/**/*', ico)
}

// Development
gulp.task('clean', clean)
gulp.task('html', html)
gulp.task('css', css)
gulp.task('js', js)
gulp.task('img', img)
gulp.task('ico', ico)
gulp.task('fonts', fonts)
gulp.task('watch', watch)

gulp.task('default', gulp.series('clean', gulp.parallel('html', 'css', 'js', 'img', 'ico', 'fonts'), 'watch'))
