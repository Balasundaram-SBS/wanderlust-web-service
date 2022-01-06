var gulp = require('gulp');
var eslint = require('gulp-eslint');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var reporters = require('jasmine-reporters');
var fs = require('fs');
var exit = require('gulp-exit');

gulp.task('lint', async () => {
    return gulp.src(['**/*.js','!node_modules/**','!gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.format('html',fs.createWriteStream('lintReports/lint_report.html')))
        .pipe(eslint.format('checkstyle', fs.createWriteStream('lintReports/checkstyle.xml')))
        .pipe(eslint.failAfterError());
});

gulp.task('test', async function(){
    return gulp.src(['test/*js'])
        .pipe(jasmine({
            reporter : new reporters.JUnitXmlReporter({
                savePath : 'testReport/JUnit/'
            })
        }))
        .pipe(exit());
});

gulp.task('pre-coverage',async function () {
    return gulp.src(['**/*.js', '!gulpfile.js', '!node_modules/**'])
      .pipe(istanbul())
      .pipe(istanbul.hookRequire());
});

gulp.task('coverage',gulp.series('pre-coverage', async function(){
    return gulp.src(['test/*.js'])
        .pipe(jasmine())
        .pipe(istanbul.writeReports({
            dir : './coverage',
            reporters : ['lcovonly', 'json', 'text', 'text-summary','cobertura'],
            reportOpts : {
                lcov: { dir : 'coverage/lcovonly', file : 'lcov.info'},
                json: {dir: 'coverage/json', file : 'converage.json'},
                cobertura: {dir: 'coverage/cobertura', file: 'cobertura-coverage.xml'}
            }
        }))
        .pipe(istanbul.enforceThresholds({ thresholds : {global : 60}}))
        .pipe(exit());
}))