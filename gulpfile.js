var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');


gulp.task('css', function () {
	var stream =  gulp.src([
		'public/components/bootstrap/dist/css/bootstrap.css',
		'public/components/fontawesome/css/font-awesome.css',
		'public/components/mapboxjs/mapbox.css',
		'public/components/leaflet.fullscreen/dist/leaflet.fullscreen.css',
		'public/css/custom/style.css'
	], {base: 'public/'})
	.pipe(replace('/*!', '/*'))
	.pipe(concat('site.css'))
	.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	.pipe(gulp.dest('public/build/css'))
	.pipe(rename({suffix: '.min'}))
	.pipe(minifyCSS())
	.pipe(gulp.dest('public/build/css'))
	.pipe(notify({ message: 'CSS task complete' }));
	return stream;
});

gulp.task('scripts', function () {
	var stream =  gulp.src([
		'public/components/angular/angular.js',
		'public/components/angular-ui-router/release/angular-ui-router.js',
		'public/components/ngstorage/ngStorage.js',
		'public/components/lodash/dist/lodash.js',
		'public/components/angular-bootstrap/ui-bootstrap-tpls.js',
		'public/js/core.js',
		'public/js/services/placeservice.js',
		'public/js/services/billservice.js',
		'public/js/services/agencyservice.js',
		'public/js/services/featureservice.js',
		'public/js/services/googleservice.js',
		'public/js/services/mapservice.js',
		'public/js/services/d3service.js',
		'public/js/services/geoservice.js',
		'public/js/services/timeservice.js',
		'public/js/directives/ngAutocomplete.js',
		'public/js/directives/ngfocus.js',
		'public/js/directives/map-user.js',
		'public/js/directives/map-agency.js',
		'public/js/directives/d3chart.js',
		'public/js/directives/d3graph-new.js',
		'public/js/directives/d3donut.js',
		'public/js/directives/ngmodal.js',
		'public/js/directives/click-banner.js'

	], {base: 'public/'})
	// .pipe(jshint('.jshintrc'))
	// .pipe(jshint.reporter('default'))
	.pipe(concat('site.js'))
	.pipe(gulp.dest('public/build/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('public/build/js'))
	.pipe(notify({ message: 'Scripts task complete' }));
	return stream;
});


