var gulp = require('gulp');

var watch = require('../config').watch;


gulp.task('watch', function() {
    for(var i = 0; i < watch.length; i++){
        var watchTask = watch[i];
        gulp.watch(watchTask.watchLocation, [watchTask.task]);
    }
});