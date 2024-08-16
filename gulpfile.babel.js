const gulp = require('gulp');
const watch = require('gulp-watch');
const ghpages = require('gh-pages');
const connect = require('gulp-connect');
const open = require('gulp-open');
const sass = require('gulp-sass')(require('sass')); // Use 'sass' compiler

require('./gulp/i18n');
require('./gulp/build');
require('./gulp/plato');

// Task to compile Sass
gulp.task('sass', () => 
    gulp
        .src('static/css/**/*.scss') // Updated source directory
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('www/css')) // Updated destination directory
);

// Task to serve files with live reload
gulp.task(
    'connect',
    gulp.series(done => {
        connect.server({
            root      : 'www',
            port      : 80,
            livereload: true,
        });
        done();
    })
);

// Task to open the browser
gulp.task(
    'open',
    gulp.series(done => {
        gulp.src('www/index.html').pipe(
            open({
                uri: 'http://localhost:80/',
            })
        );
        done();
    })
);

// Task to watch for file changes and reload
gulp.task(
    'serve',
    gulp.series('open', 'connect', done => {
        watch(['www/*.html']).pipe(connect.reload());
        done();
    })
);

// Task to release to a specific branch
gulp.task(
    'release-branch',
    gulp.series(done => {
        const index = process.argv.indexOf('--branch');
        let option = '';
        if (index <= -1) {
            throw Error('Please specify branch');
        } else {
            option = process.argv[index + 1];
        }
        ghpages
            .publish('www', {
                dest: option,
                add : true,
            })
            .then(done);
    })
);

// Task to release to the master branch
gulp.task(
    'release-master',
    gulp.series(done => {
        ghpages
            .publish('./', {
                src: ['404.md', 'LICENSE', 'README.md', 'CNAME'],
                add: true,
            })
            .then(() => {
                ghpages.publish('www', {
                    add: true,
                });
            })
            .then(done);
    })
);

// Task for testing deployment
gulp.task(
    'test-deploy',
    gulp.series('build-min', 'serve', () => {})
);

// Task to watch static files for changes
gulp.task(
    'watch-static',
    gulp.parallel(done => {
        gulp.watch(
            ['static/xml/**/*', 'static/*.html', 'static/css/**/*.scss'], // Updated path
            {
                debounceTimeout: 1000,
            },
            gulp.series('build-dev-static')
        );
        done();
    })
);

// Task to watch HTML files for changes
gulp.task(
    'watch-html',
    gulp.series(done => {
        gulp.watch(
            ['templates/**/*'],
            {
                debounceTimeout: 1000,
            },
            gulp.series('build-dev-html')
        );
        done();
    })
);

// Combined watch task
gulp.task('watch', gulp.series('build', 'sass', 'serve', 'watch-static', 'watch-html'));

// Default task
gulp.task('default', gulp.series('watch'));
