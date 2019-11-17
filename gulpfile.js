const domainName = '';

const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const del = require('del');

// Development tasks
gulp.task('html', function() {
	return gulp.src('src/*.html')
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('php', function() {
	return gulp.src('src/**/*.php')
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
	return gulp.src('src/images/**/*')
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
	gulp.watch('src/**/*.html', gulp.parallel('html'));
	gulp.watch('src/**/*.php', gulp.parallel('php'));
	gulp.watch('src/scss/**/*.scss', gulp.parallel('css'));
	gulp.watch('src/js/**/*.js', gulp.parallel('js'));
	gulp.watch('src/images/**/*', gulp.parallel('img'));
});

gulp.task('dev', gulp.parallel('html', 'php', 'css', 'js', 'img', 'watch'));

// Production tasks
gulp.task('build:html', function() {
	return gulp.src('src/**/*.html')
		.pipe(gulp.dest('dist'));
});

gulp.task('build:php', function() {
	return gulp.src('src/**/*.php')
		.pipe(gulp.dest('dist'));
});

gulp.task('build:js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('build:css', function() {
	const plugins = [
		autoprefixer(),
		cssnano()
	];
	return gulp.src('src/css/**/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('dist/css'));
});


gulp.task('build:img', function() {
	return gulp.src('src/images/**/*.*')
		.pipe(gulp.dest('dist/images'));
});

gulp.task('build:fonts', function() {
	return gulp.src('src/fonts/**/*.*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', gulp.parallel('clean', gulp.series('build:html', 'build:php', 'build:js', 'build:css', 'build:img', 'build:fonts')));

// Default
gulp.task('default', gulp.series('dev'));
