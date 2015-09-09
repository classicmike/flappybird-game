var gulp = require('gulp');
var imagemin = require('gulp-imagemin');


var imagesConfig = require('../config').images.config;

// Image optimization task
gulp.task('images', function(){
    gulp.src(imagesConfig.src)
        .pipe(imagemin())
        .pipe(gulp.dest(imagesConfig.dest));
});