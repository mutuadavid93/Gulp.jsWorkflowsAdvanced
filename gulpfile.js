var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    gutil = require('gulp-util');
    
var coffeeSources = [
    'components/coffee/tagline.coffee'
];

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
            .pipe(coffee({ bare: true }))
            .on('error', gutil.log)
            .pipe(gulp.dest('components/scripts'));
});
