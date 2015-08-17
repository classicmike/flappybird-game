var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var browserifyConfig = require('../config').browserify;

//browserify task
gulp.task('browserify', function(){
    var browserified = transform(function(fileName){
        var b = browserify(fileName);
        return b.bundle();
    });

    return gulp.src(browserifyConfig.src)
        .pipe(browserified)
        .pipe(browserifyConfig.sourceDestinationFile)
        .pipe(uglify())
        .pipe(gulp.dest(browserifyConfig.dest));
});

