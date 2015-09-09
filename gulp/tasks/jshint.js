var gulp = require('gulp');
var jshint = require('gulp-jshint');

var jshintConfig = require('../config').jshint.config;

var browserifyTask = require('../tasks/browserify');

gulp.task('jshint', ['browserify'], function(){
    return gulp.src(jshintConfig.src)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
