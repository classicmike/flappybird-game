var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');

var config = require('../config').html.config;

gulp.task('html_default', function(){
    gulp.src(config.src)
        .pipe(minifyHTML())
        .pipe(gulp.dest(config.dest));
});