var gulp = require('gulp');
var jshint = require('gulp-jshint');

module.exports = function(jshintConfig){
    gulp.task('jshint', ['browserify'], function(){
        return gulp.src(jshintConfig.src)
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });
};
