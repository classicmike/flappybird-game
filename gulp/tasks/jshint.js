var gulp = require('gulp');
var jshint = require('gulp-jshint');

var jshintConfig = require('../config').config;

var browserifyTask = require('../tasks/browserify');

gulp.task('jshint', ['browserify'], function(){
    return gulp.src('site/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});