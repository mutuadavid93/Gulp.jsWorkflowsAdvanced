var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    compass = require('gulp-compass'),
    gutil = require('gulp-util');
    
var env, 
    coffeeSources,
    jsonSources,
    htmlSources,
    sassStyle,
    sassSources,
    jsSources,
    outputDir;
    
env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
}else{
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = [
    'components/coffee/tagline.coffee'
];

jsonSources = [
    outputDir + 'js/*.json'
];

htmlSources = [
    outputDir + '*.html'
];

sassSources = [
    'components/sass/style.scss'
];

jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

gulp.task('coffee', function() {
    gulp.src(coffeeSources)
            .pipe(coffee({ bare: true }))
            .on('error', gutil.log)
            .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function () {
    gulp.src(jsSources)
            .pipe(concat('script.js'))
            .pipe(browserify())
            .pipe(gulpif(env === 'production', uglify()))
            .pipe(gulp.dest(outputDir + 'js'))
            .pipe(connect.reload());
});

gulp.task('compass', function () {
    gulp.src(sassSources)
            .pipe(compass({
                sass: 'components/sass',
                image: outputDir + 'images',
                style: sassStyle
            }))
            .on('error', gutil.log)
            .pipe(gulp.dest(outputDir + 'css'))
            .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src(htmlSources)
            .pipe(connect.reload());
});

gulp.task('json', function () {
    gulp.src(jsonSources)
            .pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);