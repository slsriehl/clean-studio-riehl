var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');

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

//var reload  = browserSync.reload;

var reloadOnChange = function() {
	// Reloads the browser whenever node, CSS, or JS files change
	gulp.watch(['./controllers/*.js'], [reload]);
	gulp.watch('./routes/*.js', [reload]);
	gulp.watch('./server.js', [reload]);
	gulp.watch('./src/css/*.css', [reload]);
	gulp.watch('./src/js/*.js', [reload]);
}

// Compile scss files from /scss into /css
gulp.task('compile-concat-scss', function() {
	return gulp.src('./src/scss/*.scss')
		.pipe(sass())
		.pipe(concat('styles.css'))
		.pipe(header(banner))
		.pipe(gulp.dest('./public/css'))
});

//concat js
gulp.task('concat-index-js', function() {
	return gulp.src('./src/js/public/*.js')
		.pipe(concat('index.js'))
		.pipe(header(banner))
		.pipe(gulp.dest('./public/js'))
});

//move pay js
gulp.task('concat-pay-js', function() {
	return gulp.src('./src/js/pay/*.js')
		.pipe(concat('pay.js'))
		.pipe(header(banner))
		.pipe(gulp.dest('./public/js'))
});


//minify-css
gulp.task('minify-css', function() {
	return gulp.src('./public/css/styles.css')
	.pipe(cleanCSS({ compatibility: 'ie8'}))
	.pipe(rename({ suffix: '.min'}))
	.pipe(gulp.dest('./public/css'))
});

//minify index js
gulp.task('minify-index-js', function(cb) {
	pump([
			gulp.src('./public/js/index.js'),
			uglify(),
			rename({ suffix: '.min' }),
			gulp.dest('./public/js')
	], cb);
});

//minify pay js
gulp.task('minify-pay-js', function(cb) {
	pump([
			gulp.src('./public/js/pay.js'),
			uglify(),
			rename({ suffix: '.min' }),
			gulp.dest('./public/js')
	], cb);
});

// dev task to compile and reload in development
gulp.task('dev', [/* 'browser-sync', */'compile-concat-scss', 'concat-index-js', 'concat-pay-js'], function() {
		gulp.watch('./src/scss/*/*.scss', ['compile-concat-scss']);
		gulp.watch('./src/js/pay/*.js', ['concat-pay-js']);
		gulp.watch('./src/js/index/*.js', ['concat-index-js']);
		//reloadOnChange();
});

//production task to compile, minify, and reload
gulp.task('prod', [/* 'browser-sync',*/'minify-index-js', 'minify-pay-js', 'minify-css'], function() {
		gulp.watch('./public/css/styles.css', ['minify-css']);
		gulp.watch('./public/js/index.js', ['minify-index-js']);
		gulp.watch('./public/js/pay.js', ['minify-pay-js']);
		//reloadOnChange();
});
