/**
 * Created by amills001c on 2/12/16.
 */

var suman = require('/Users/amills001c/WebstormProjects/ORESoftware/suman');
var Test = suman.init(module);

Test.describe('suite uno', function () {

    this.it('[test]', function (done) {
        var ndc = require('../');
        done(ndc.run()); //if no options are passed, ndc.run should ndc.conf.js file at root of the project
    });
});