var gulp = require('gulp');
var concat = require('gulp-concat');


var config = require('../config').styles.config;

// Styles build task, concatenates all the files
gulp.task('styles', function(){
    gulp.src(config.src)
        .pipe(concat(config.sourceDestinationFile))
        .pipe(gulp.dest(config.dest));
});