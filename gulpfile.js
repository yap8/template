const domainName = '';

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const del = require('del');
const webpack = require('webpack-stream');

// Development tasks

gulp.task('html', function() {
	return gulp.src('src/*.html')
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('php', function() {
	return gulp.src('src/*.php')
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer({overRideBrowsers: ['last 10 versions']}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src('src/js/app.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('src/js/'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
	return gulp.src('src/images/*')
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', async function() {
	return del.sync('dist')
});

gulp.task('watch', function() {
	if (domainName) {
		browserSync.init({
			proxy: domainName
		});
	} else {
		browserSync.init({
			server: {
				baseDir: "src/"
			}
		});
	}
	gulp.watch('src/*.html', gulp.parallel('html'));
	gulp.watch('src/**/*.php', gulp.parallel('php'));
	gulp.watch('src/scss/**/*.scss', gulp.parallel('css'));
	gulp.watch(["src/js/**/*.js", "!src/js/main.js"], gulp.parallel('js'));
	gulp.watch('src/images/**/*', gulp.parallel('img'));
});

// Production tasks
gulp.task('export', async function() {
	const buildHtml = gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'));
	
	const buildPHP = gulp.src('src/**/*.php')
		.pipe(gulp.dest('dist'));
		
	const BuildCss = gulp.src('src/css/**/*.css')
		.pipe(cssnano({
			discardComments: {removeAll: true}
		}))
		.pipe(gulp.dest('dist/css'));

	const BuildJs = gulp.src('src/js/main.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
		
	const BuildFonts = gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'));

	const BuildImg = gulp.src('src/images/**/*.*')
		.pipe(gulp.dest('dist/images'));
});

gulp.task('build', gulp.parallel('clean', 'export'));


// DEFAULT
gulp.task('default', gulp.series('html', 'php', 'css', 'js', 'img', 'watch'));
