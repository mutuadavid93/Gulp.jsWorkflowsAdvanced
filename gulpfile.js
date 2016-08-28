var gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    imagemin = require('gulp-imagemin'),
    jsonMin = require('gulp-jsonminify'),
    pngcrush = require('imagemin-pngcrush'),
    compass = require('gulp-compass'),
    minifyHTML = require('gulp-minify-html'),
    gutil = require('gulp-util');
    
var env, 
    coffeeSources,
    jsonSources,
    htmlSources,
    sassStyle,
    sassSources,
    jsSources,
    outputDir;
    
env = process.env.NODE_ENV || 'production';

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
 outputDir + '/js/*.json'
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
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
    gulp.watch('builds/development/images/**/*', ['images']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('connect', function () {
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('html', function () {
    gulp.src('builds/development/*.html')
            .pipe(gulpif(env==='production', minifyHTML()))
            .pipe(gulpif(env==='production', gulp.dest(outputDir)))
            .pipe(connect.reload());
});

gulp.task('json', function () {
    gulp.src('builds/development/js/*.json')
            .pipe(gulpif(env==='production', jsonMin()))
            .pipe(gulpif(env==='production', gulp.dest('builds/production/js')))
            .pipe(connect.reload());
});

gulp.task('images', function () {
    gulp.src('builds/development/images/**/*')
            .pipe(gulpif(env==='production', imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox:false }],
                plugins: [pngcrush()]
            })))
            .pipe(gulpif(env==='production', gulp.dest(outputDir + 'images')));
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'watch']);