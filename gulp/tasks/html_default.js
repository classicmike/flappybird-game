var gulp = require('gulp');
var minifyHTML = require('gulp-minify-html');

module.exports = function(htmlConfig){
    gulp.task('html_default', function(){
        gulp.src(htmlConfig.src)
            .pipe(minifyHTML())
            .pipe(gulp.dest(htmlConfig.dest));
    });
};