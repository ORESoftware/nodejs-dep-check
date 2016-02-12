/*
 * created by Olegzandr Denman
 *
 * */

//context
//gwt

//
//var suman = require('../index.js');
//var Test = suman.make(module, 'test/config/sumanConfig');
//
//
//Test.createSuite('suite uno', function (suite) {

var Test = require('suman').Test(module, 'suman.conf.js');


Test.describe('suite uno', function () {


    it('[test]', function (done) {
        var ndc = require('../');

        var result = ndc.run({
            verbose: true,
            ignorePaths: ['/node_modules/', 'gulpfile.js'],
            ignoreDirs: ['node_modules', 'test'],
            ignoreModules: ['colors/safe']
        });

        done(result);
    });


});


