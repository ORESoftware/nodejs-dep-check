/*
 * created by Olegzandr Denman
 *
 * */


var suman = require('/Users/amills001c/WebstormProjects/ORESoftware/suman');
var Test = suman.init(module);


Test.describe('suite uno', function () {


    this.it('[test]', function (done) {

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


