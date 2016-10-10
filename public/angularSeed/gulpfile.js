(function () {
    var gulp = require('gulp'),
        Promise = require('es6-promise').Promise,
        babel = require('gulp-babel'),
        $$ = require('gulp-load-plugins')(),
        del = require('del'),
        config = {
            pathLibJs: [
                'bower_components/jquery/dist/jquery.min.js',
                'bower_components/jquery-ui/ui/jquery-ui.js',
                'bower_components/angular/angular.min.js',
                'bower_components/angular-route/angular-route.min.js',
                'bower_components/angular-animate/angular-animate.min.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
                'bower_components/spin.js/spin.js',
                'bower_components/angular-spinner/angular-spinner.min.js',
                'bower_components/moment/min/moment.min.js',
                'bower_components/lodash/dist/lodash.min.js',
                'bower_components/select2/dist/js/select2.full.min.js',
                'bower_components/angular-ui-slider/src/slider.js',
                'bower_components/highcharts/highcharts.js'
            ],
            pathAppJs: ['./app/modules.js', './app/**/*.js'],
            pathMainSass: './sass/*.scss',
            pathAppSass: './app/**/*.scss',
            distFolder: 'dist/',
            appFolder: 'app/',
            distAppJsFile: 'app.combined.min.js',
            distLibsJsFile: 'libs.combined.min.js',
            distCssFile: 'allStyles.css',
            pathAppHtml: 'app/**/*.html',
            bootstrapFile: [
                'bower_components/bootstrap/dist/css/bootstrap.min.css',
                'bower_components/bootstrap/dist/css/bootstrap.min.css.map',
                'bower_components/jquery-ui/themes/smoothness/jquery-ui.css',
                'bower_components/select2/dist/css/select2.min.css'
            ]
        };

    gulp.task('default', [
        'sass',
        'distCopy',
        'bootstrapCopy',
        'templates',
        'concatAppJs',
        'concatLibsJs'
    ]);

    gulp.task('distCopy', function () {
        gulp.src(['fonts/*'])
            .pipe($$.copy(config.distFolder + '/fonts/', {
                prefix: 20
            }));

        gulp.src(['img/*'])
            .pipe($$.copy(config.distFolder + '/img/', {
                prefix: 20
            }));

        return gulp.src(['index.html'])
            .pipe($$.copy(config.distFolder, {
                prefix: 20
            }));
    });

    gulp.task('bootstrapCopy', function () {
        return gulp.src(config.bootstrapFile)
            .pipe($$.copy(config.distFolder + 'libs', {
                prefix: 20
            }));
    });

    gulp.task('templates', function () {
        return gulp.src(config.pathAppHtml)
            .pipe($$.angularTemplatecache({
                standalone: true,
                moduleSystem: 'IIFE'
            }))
            .pipe(gulp.dest(config.distFolder));
    });

    gulp.task('cleanDistCss', function () {
        return del([
            config.distFolder + config.distCssFile
        ]);
    });

    gulp.task('concat', ['cleanDistJs'], function () {
        gulp.src(config.pathToCombineJs)
            //.pipe($$.sourcemaps.init())
            .pipe($$.concat(config.distJsFile))
            .pipe($$.uglify())
            .pipe($$.header('//combined version\n'))
            //.pipe($$.sourcemaps.write())
            .pipe(gulp.dest(config.distFolder));
    });

    gulp.task('concatAppJs', function () {
        del([config.distFolder + 'libs' + config.distAppJsFile]);

        return gulp.src(config.pathAppJs)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe($$.concat(config.distAppJsFile))
            //.pipe($$.uglify())
            .pipe($$.header('//combined version\n'))
            .pipe(gulp.dest(config.distFolder));
    });

    gulp.task('concatLibsJs', function () {
        del([config.distFolder + 'libs' + config.distLibsJsFile]);

        return gulp.src(config.pathLibJs)
            .pipe($$.concat(config.distLibsJsFile))
            .pipe($$.uglify())
            .pipe($$.header('//combined version\n'))
            .pipe(gulp.dest(config.distFolder + 'libs'));
    });

    gulp.task('uglify', function () {
        gulp.src(config.distFolder + config.distJsFile)
            .pipe($$.uglify())
            .pipe(gulp.dest(config.distFolder));
    });

    gulp.task('sass', ['cleanDistCss'], function () {
        gulp.src(config.pathMainSass)
            .pipe($$.sass())
            .pipe($$.cssnano())
            .pipe(gulp.dest(config.distFolder));
    });

    gulp.task('jshint', function () {
        gulp.src(config.pathAppJs)
            .pipe($$.jshint())
            .pipe($$.jshint.reporter('jshint-stylish'));
    });

    gulp.task('jscs', function () {
        gulp.src(config.pathAppJs)
            .pipe($$.jscs())
            .pipe($$.jscs.reporter());
    });

    gulp.task('watch', function () {
        gulp.watch([config.pathMainSass, config.pathAppSass], ['sass']);
        gulp.watch(config.pathAppJs, ['concatAppJs']);
        gulp.watch(config.pathAppHtml, ['templates']);
    });
}());
