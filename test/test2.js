/**
 * Created by denman on 10/18/2015.
 */


describe('@test-dep-check', function () {

    var assert = require('assert');

    it('[test]', function (done) {

        var ndc = require('../');

        var result = ndc.run({
            verbose: true,
            ignorePaths: ['/node_modules/','gulpfile.js'],
            ignoreDirs: ['node_modules', 'test'],
            ignoreModules: ['colors/safe']
        });

        done(result);

    });

});