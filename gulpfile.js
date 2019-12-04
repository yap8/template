// Domain name for backend development, leave empty if frontend only
const domainName = ''

// Language/template engine that will be used, options: html, php, pug
const lang = 'html'

// Requires
const gulp = require('gulp'),
			pug = require('gulp-pug'),
			sass = require('gulp-sass'),
			postcss = require('gulp-postcss'),
			autoprefixer = require('autoprefixer'),
			cssnano = require('cssnano'),
			browserSync = require('browser-sync').create(),
			uglify = require('gulp-uglify'),
			concat = require('gulp-concat'),
			babel = require('gulp-babel'),
			tinypng = require('gulp-tinypng-unlimited'),
			del = require('del')

// Functions
// Misc
const serve = () => {
	if (domainName) {
		browserSync.init({
			proxy: domainName
		})
	} else {
		browserSync.init({
			server: {
				baseDir: "src/"
			}
		})
	}
}

const clean = () =>
	del('dist')

const cleanPhp = () =>
	del(['src/*.php', 'src/includes'])

const cleanPug = () =>
	del('src/pug')

// Development
const html = () =>
	gulp.src('src/**/*.html')

const php = () =>
	gulp.src('src/**/*.php')

const htmlPug = () =>
	gulp.src('src/pug/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('src/'))

const css = () =>
	gulp.src('src/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream())

const jsLib = () =>
	gulp.src(['']) // Javascript library connection
		.pipe(concat('lib.js'))
		.pipe(gulp.dest('src/js'))

const js = () =>
	gulp.src(['src/js/**/*.js', '!src/js/script.js'])
		.pipe(concat('script.js'))
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.stream())

const img = () =>
	gulp.src('src/img/**/*')
		.pipe(browserSync.stream())

const watch = () => {
	serve()
	if (lang === 'html') {
		gulp.watch('src/**/*.html', html).on('change', browserSync.reload)
	} else if (lang === 'php') {
		gulp.watch('src/**/*.php', php).on('change', browserSync.reload)
	} else if (lang === 'pug') {
		gulp.watch('src/**/*.pug', htmlPug).on('change', browserSync.reload)
	}
	gulp.watch('src/scss/**/*.scss', css)
	gulp.watch(['src/js/**/*.js', '!src/js/script.js'], js)
	gulp.watch('src/img/**/*', img)
}

// Production tasks
const buildHtml = () =>
	gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'))

const buildPhp = () =>
	gulp.src('src/**/*.php')
		.pipe(gulp.dest('dist'))

const buildJs = () =>
	gulp.src('src/js/script.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify({
			toplevel: true
		}))
		.pipe(gulp.dest('dist/js'))

const buildCss = () => {
	const plugins = [
		autoprefixer({
			cascase: false
		}),
		cssnano()
	]
	return gulp.src('src/css/**/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('dist/css'))
}

const buildImg = () =>
	gulp.src('src/img/**/*')
		.pipe(tinypng())
		.pipe(gulp.dest('dist/img'))

const buildFonts = () =>
	gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'))

// Bind functions to tasks
// Development
gulp.task('clean', clean)
gulp.task('clean:php', cleanPhp)
gulp.task('clean:pug', cleanPug)

gulp.task('html', html)
gulp.task('php', php)
gulp.task('html:pug', htmlPug)
gulp.task('css', css)
gulp.task('js:lib', jsLib)
gulp.task('js', js)
gulp.task('img', img)
gulp.task('watch', watch)
// Production
gulp.task('build:html', buildHtml)
gulp.task('build:php', buildPhp)
gulp.task('build:js', buildJs)
gulp.task('build:css', buildCss)
gulp.task('build:img', buildImg)
gulp.task('build:fonts', buildFonts)

// Combined tasks
if (lang === 'html') {
	gulp.task('start', gulp.series('clean:php', 'clean:pug', gulp.parallel('html', 'css', 'js', 'img'), 'watch'))
} else if (lang === 'php') {
	gulp.task('start', gulp.series('clean:pug', gulp.parallel('php', 'css', 'js', 'img'), 'watch'))
} else if (lang === 'pug') {
	gulp.task('start', gulp.series('clean:php', gulp.parallel('html:pug', 'css', 'js', 'img'), 'watch'))
}

gulp.task('build', gulp.series('clean', gulp.parallel('build:html', 'build:php', 'build:js', 'build:css', 'build:img', 'build:fonts')))
gulp.task('default', gulp.series('start'))
