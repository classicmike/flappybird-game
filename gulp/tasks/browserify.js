var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var transform = require('vinyl-transform');

var browserifyConfig = require('../config').browserify;

//browserify task
gulp.task('browserify', function(){
    // Browserify/bundle the css
    browserify(browserifyConfig.bundleConfigs.src)
        .bundle()
        .pipe(source(browserifyConfig.bundleConfigs.sourceDestinationFile))
        .pipe(gulp.dest(browserifyConfig.bundleConfigs.dest));
});

