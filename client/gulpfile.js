'use strict'

//dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var changed = require('gulp-changed');


//file locations
var scss_src = './src/assets/scss/**/*.scss';
var scss_dest = './src/assets/css';


//compile scss
gulp.task('compile_scss',function(){

	gulp.src(scss_src)
	.pipe(sass().on('error', sass.logError))
	.pipe(minifyCSS())
	.pipe(rename({ suffix: '.min' }))
	.pipe(changed(scss_dest))
	.pipe(gulp.dest(scss_dest))

});


//dectect changes in scss files
gulp.task('watch_scss', function(){

	gulp.watch(scss_src, ['compile_scss']);

});


//run tasks
gulp.task('default', ['watch_scss']);