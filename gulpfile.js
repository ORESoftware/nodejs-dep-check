/**
 * Created by amills001c on 12/9/15.
 */

//core
var gulp = require('gulp');
//var suman = require('suman');
var suman = require('/Users/amills001c/WebstormProjects/ORESoftware/suman');


//args & env
var argv = JSON.parse(JSON.stringify(process.argv));

var $node_env = process.env.NODE_ENV;


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


if(argv[2] && argv[2].indexOf('gulpfile') < 0){
    gulp.start('run_tests');
}
