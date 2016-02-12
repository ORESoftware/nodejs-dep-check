/**
 * Created by amills001c on 12/9/15.
 */

//core
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var tcpp = require('tcp-ping');
var suman = require('suman');

//args & env
var argv = process.env.argv;
var $node_env = process.env.NODE_ENV;


gulp.task('run_tests', ['suman'], function (cb) {

    //testRunner('./test/build-tests','suman.conf.js');

    suman.Runner({
        $node_env: process.env.NODE_ENV,
        fileOrDir: './test/test1.js',
        configPath: './suman.conf.js'
    }).on('message', function (msg) {
        console.log('msg from suman runner', msg);
        //process.exit();
    });

});


gulp.task('suman', [], function (cb) {

    //first ping server to make sure it's running, otherwise, continue
    tcpp.probe('127.0.0.1', '6969', function (err, available) {
        if (err) {
            console.error(err);
        }
        else if (available) {
            console.log('suman server already running');
            cb(null);
        }
        else {
            suman.Server({
                configPath: './suman.conf.js'
            }).on('message', function (msg) {
                console.log('msg from suman server', msg);
                cb();
            });
        }
    });
});


process.on('exit', function () {
    console.log('gulp is exiting...');
});
