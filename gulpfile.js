// Domain name for backend development, leave empty if frontend only
const domainName = ''

// Functions
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

// Requires
const gulp = require('gulp'),
			sass = require('gulp-sass'),
			postcss = require('gulp-postcss'),
			autoprefixer = require('autoprefixer'),
			cssnano = require('cssnano'),
			browserSync = require('browser-sync'),
			uglify = require('gulp-uglify'),
			concat = require('gulp-concat'),
			babel = require('gulp-babel'),
			del = require('del')

// Development tasks
gulp.task('html', () =>
	gulp.src('src/**/*.html')
		.pipe(browserSync.reload({stream: true}))
)

gulp.task('php', () =>
	gulp.src('src/**/*.php')
		.pipe(browserSync.reload({stream: true}))
)

gulp.task('css', () =>
	gulp.src('src/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}))
)

gulp.task('js', () =>
	gulp.src(['src/js/**/*.js', '!src/js/script.js'])
		.pipe(concat('script.js'))
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.reload({stream: true}))
)

gulp.task('img', () =>
	gulp.src('src/images/**/*')
		.pipe(browserSync.reload({stream: true}))
)

gulp.task('clean', async () =>
	del.sync('dist')
)

gulp.task('watch', () => {
	serve()
	gulp.watch('src/**/*.html', gulp.parallel('html'))
	gulp.watch('src/**/*.php', gulp.parallel('php'))
	gulp.watch('src/scss/**/*.scss', gulp.parallel('css'))
	gulp.watch(['src/js/**/*.js', '!src/js/script.js'], gulp.parallel('js'))
	gulp.watch('src/images/**/*', gulp.parallel('img'))
})

gulp.task('dev', gulp.parallel('html', 'php', 'css', 'js', 'img', 'watch'))

// Production tasks
gulp.task('build:html', function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'))
})

gulp.task('build:php', function() {
	return gulp.src('src/**/*.php')
		.pipe(gulp.dest('dist'))
})

gulp.task('build:js', function() {
	return gulp.src('src/js/script.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
})

gulp.task('build:css', () => {
	const plugins = [
		autoprefixer({
			cascase: false
		}),
		cssnano()
	]
	return gulp.src('src/css/**/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('dist/css'))
})

gulp.task('build:img', function() {
	return gulp.src('src/images/**/*.*')
		.pipe(gulp.dest('dist/images'))
})

gulp.task('build:fonts', function() {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'))
})

gulp.task('build', gulp.parallel('clean', gulp.series('build:html', 'build:php', 'build:js', 'build:css', 'build:img', 'build:fonts')))

// Default task
gulp.task('default', gulp.series('dev'))
