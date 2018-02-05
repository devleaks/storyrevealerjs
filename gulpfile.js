'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var replace = require('gulp-replace');
var rewriteCSS = require('gulp-rewrite-css');

var dest = './dist';

gulp.task('sass', function () {
	return  gulp.src('./css/storyrevealer.scss')
				.pipe(sass.sync().on('error', sass.logError))
				.pipe(gulp.dest('./css'));
});

gulp.task('copyfonts', function() {
	gulp.src('css/fonts/**/*.{css,woff}')
	    .pipe(gulp.dest(dest+'/css/fonts'));
});

gulp.task('copyjs', function() {
	gulp.src([
		'node_modules/reveal.js/lib/js/classList.js',
		'node_modules/reveal.js-menu/menu.js',
		'node_modules/reveal.js-menu/menu.css',
		'node_modules/reveal.js-plugins/anything/anything.js',
		'js/highlight/highlight.pack.js',
		'js/moving-letters.js',
		'js/storyrevealer-animation-plugin.js'
	])
    .pipe(gulp.dest(dest+'/js/plugins'));
});

gulp.task('concatcss', function () {
	return gulp.src([
		"node_modules/reveal.js/css/reveal.css",
		"node_modules/reveal.js/lib/css/zenburn.css",
		"node_modules/font-awesome/css/font-awesome.css",
		"css/moving-letters.css",
		"css/storyrevealer.css"
	])
    .pipe(rewriteCSS({
		destination: dest+'/css'
	}))
    .pipe(concat("storyrevealer.css"))
    .pipe(gulp.dest(dest+'/css'));
});

gulp.task('concatjs', function() {
	return gulp.src([
		"node_modules/reveal.js/lib/js/head.min.js",
		"node_modules/reveal.js/js/reveal.js",
		"node_modules/d3-collection/build/d3-collection.min.js",
		"node_modules/d3-dispatch/build/d3-dispatch.min.js",
		"node_modules/d3-dsv/build/d3-dsv.min.js",
		"node_modules/d3-request/build/d3-request.min.js",
		"node_modules/d3-selection/build/d3-selection.min.js",
		"node_modules/yamljs/dist/yaml.js",	
		"node_modules/@emmetio/expand-abbreviation/dist/expand-full.js",
		"node_modules/sanitize-html/dist/sanitize-html.js",
		"node_modules/mustache/mustache.js",
		"node_modules/patternomaly/dist/patternomaly.js",
		"node_modules/moment/moment.js",
		"node_modules/chart.js/dist/Chart.js",
		"node_modules/chartist/dist/chartist.js",
		"node_modules/chartist-plugin-legend/chartist-plugin-legend.js",
		"node_modules/animejs/anime.js",	
		"js/storyrevealer.js"
    ])
    .pipe(concat('storyrevealer.js'))
    .pipe(gulp.dest(dest+'/js'));
});

gulp.task('templates', function() {
  gulp.src(['tests/template.html'])
    .pipe(replace('template.json', function() {
      // Replaces instances of "template.json" with "file.txt"
      // this.file is also available for regex replace
      // See https://github.com/gulpjs/vinyl#instance-properties for details on available properties
      return this.file.relative.substr(0, this.file.relative.lastIndexOf('.')) + '.yaml';
    }))
    .pipe(gulp.dest(dest+'/demos'));
});


gulp.task('default', ['sass', 'concatcss', 'concatjs', 'copyfonts', 'copyjs']);

gulp.task('css', ['sass']);