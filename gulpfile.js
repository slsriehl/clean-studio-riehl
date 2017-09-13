var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Set the banner content
var banner = ['/*!\n',
		' * Studio Riehl Portfolio - 2.0 - studioriehl.com\n\n',
		' * MIT License\n',
		' * Copyright 2016-' + (new Date()).getFullYear(), ' Sarah Schieffer Riehl\n',
		' * Permission is hereby granted, free of charge, to any person obtaining a copy\n',
		' * of this software and associated documentation files (the "Software"), to deal\n',
		' * in the Software without restriction, including without limitation the rights\n',
		' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n',
		' * copies of the Software, and to permit persons to whom the Software is\n',
		' * furnished to do so, subject to the following conditions:\n\n',
		' * The above copyright notice and this permission notice shall be included in all\n',
		' * copies or substantial portions of the Software.\n\n',
		' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n',
		' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n',
		' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n',
		' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n',
		' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n',
		' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n',
		' * SOFTWARE.\n',
		' */\n'
].join('');

var reload  = browserSync.reload;

gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('browser-sync',['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:5000",
		files: ["public/**/*.*"],
		browser: "google chrome",
		port: 7000,
	});
});

// Compile scss files from /scss into /css
gulp.task('compile-concat-scss', function() {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass())
		.pipe(concat('styles.css'))
		.pipe(header(banner))
		.pipe(gulp.dest('./src/css'))
});

gulp.task('minify-css', function() {
	return gulp.src('./src/css/*.css')
	.pipe(cleanCSS({ compatibility: 'ie8'}))
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('./public/css'))
});

//minify js
gulp.task('minify-js', function() {
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('./public/js'))
});

// dev task to compile and reload in development
gulp.task('dev', ['browser-sync', 'compile-concat-scss', 'compile-concat-coffee'], function() {
		gulp.watch('./src/scss/*/*.scss', ['compile-concat-scss']);
		gulp.watch('./src/coffee/*.coffee', ['compile-concat-coffee']);
		// Reloads the browser whenever PHP, CSS, or JS files change
		gulp.watch(['./*.php'], [reload]);
		gulp.watch('./php/*.php', [reload]);
		gulp.watch('index.php', [reload]);
		gulp.watch('./src/css/*.css', [reload]);
		gulp.watch('./src/js/*.js', [reload]);
});

//production task to compile, minify, and reload
gulp.task('prod', ['browser-sync','compile-concat-scss', 'compile-concat-coffee', 'minify-js', 'minify-css'], function() {
		gulp.watch('./src/scss/*/*.scss', ['compile-concat-scss', 'minify-css']);
		gulp.watch('./src/coffee/*/*.coffee', ['compile-concat-coffee', 'minify-js']);
		// Reloads the browser whenever PHP, CSS, or JS files change
		gulp.watch(['./*.php'], [reload]);
		gulp.watch('./php/*.php', [reload]);
		gulp.watch('index.php', [reload]);
		gulp.watch('./src/css/*.css', [reload]);
		gulp.watch('./src/js/*.js', [reload]);
});
