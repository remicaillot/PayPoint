const gulp = require('gulp');
var builder = require('gulp-node-webkit-builder');

gulp.task("build", function(){
    return gulp.src(['./app/*'])
        .pipe(
            builder({
                version: 'v0.20.1',
                platforms: ['linux64']
            })
        );
});

gulp.task('default', ['build']);