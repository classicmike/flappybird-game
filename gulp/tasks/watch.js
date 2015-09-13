var gulp = require('gulp');

module.exports = function(watchConfig){
    gulp.task('watch', function() {
        for(var i = 0; i < watchConfig.length; i++){
            var watchTask = watchConfig[i];
            gulp.watch(watchTask.watchLocation, [watchTask.task]);
        }
    });
};