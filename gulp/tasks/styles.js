var gulp = require('gulp');
var concat = require('gulp-concat');

module.exports = function(stylesConfig){
    // Styles build task, concatenates all the files
    gulp.task('styles', function(){
        gulp.src(stylesConfig.src)
            .pipe(concat(stylesConfig.sourceDestinationFile))
            .pipe(gulp.dest(stylesConfig.dest));
    });
};