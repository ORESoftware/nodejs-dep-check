/**
 * Created by amills001c on 12/9/15.
 */

//core
var gulp = require('gulp');
//var suman = require('suman');
var suman = require('/Users/amills001c/WebstormProjects/ORESoftware/suman');

//gulp plugins
var babel = require('gulp-babel');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rename = require('gulp-rename');
var nodemon = require('gulp-nodemon');



//args & env
var argv = JSON.parse(JSON.stringify(process.argv));

var $node_env = process.env.NODE_ENV;


gulp.task('transpile', [/*'clean-temp'*/], function () {
    return gulp.src(['test/**/*.js'])
        .pipe(babel({
            modules:'common'
        }))
        .pipe(gulp.dest('test-dest'));
});




gulp.task('run_tests', [], function (cb) {

    suman.Runner({
        $node_env: $node_env,
        fileOrDir: 'test/test1.js',
        configPath: 'suman.conf.js'
    }).on('message', function (msg) {
        console.log('msg from suman runner', msg);
        //process.exit();
    });

});


//if(argv[2] && argv[2].indexOf('gulpfile') < 0){
//    gulp.start('run_tests');
//}
