var gulp = require('gulp');

module.exports = function(buildConfig){
    gulp.task('build', buildConfig.tasks);
};