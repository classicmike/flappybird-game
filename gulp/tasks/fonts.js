var gulp = require('gulp');


module.exports = function(fontsConfig){
    gulp.task('fonts', function(){
        gulp.src(fontsConfig.src)
            .pipe(gulp.dest(fontsConfig.dest));
        console.log(fontsConfig.dest);

    });
};

