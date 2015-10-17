/**
 * Created by amills001c on 10/15/15.
 */


var fs = require("fs");
var path = require('path');
var _ = require('underscore');
var appRoot = require('app-root-path');
var colors = require('colors');
var debug = require('debug')('ndc');
var detective = require('detective');


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//var regex = new RegExp(/\srequire[^//]/g);

var regex = /[=|\s]require\(([^)]+)\)/g;


var dependencyArray = null;
var devDependencyArray = null;

//var acceptableExtensions = ['.js', '.jsx', '.ts'];

var acceptableExtensions = ['.js'];

var coreModules = [
    'fs',
    'http',
    'child_process',
    'os',
    'cluster',
    'qs',
    'crypto',
    'buffer',
    'events',
    'net',
    'v8',
    'stream',
    'string_decoder',
    'readline',
    'path',
    'util',
    'assert',
    'dns',
    'https',
    'vm',
    'zlib',
    'url'
];

var opts = null;
var ignoreDirs = null;
var ignorePaths = null;
var errors = [];


var getAllFilesFromFolder = function (dir) {

    var stat = null;

    fs.readdirSync(dir).forEach(function (file) {

        if (_.contains(ignoreDirs, file)) {

            if (opts.verbose) {
                console.log(colors.yellow('(ignore dir option) ignored this path:'), dir + '/' + file);
            }

        }
        else {

            file = path.resolve(path.normalize(dir + '/' + file));

            if (_.contains(ignorePaths, file)) {
                if (opts.verbose) {
                    console.log(colors.yellow('(ignore path option) ignored this path:'), dir + '/' + file);
                }
            }
            else {

                stat = fs.statSync(file);

                if (stat && stat.isDirectory()) {
                    getAllFilesFromFolder(file);
                }
                else if (stat) {
                    var str = String(file);
                    if (_.contains(acceptableExtensions, path.extname(str))) {
                        analyzeFile(str);
                    }
                }
                else {
                    console.log('warning: no stat');
                }
            }
        }
    });
};

function analyzeFile(filePath) {

    var statements = [];

    var src = fs.readFileSync(filePath);

    //var arrMatches = String(str).match(regex);
    //
    //var temp1 = (arrMatches || []).map(function (item) {
    //    return item.split("\'")[1] || null;
    //}).filter(function (item) {
    //    return (item && String(item).indexOf('.') !== 0)
    //});
    //
    //
    //var temp2 = (arrMatches || []).map(function (item) {
    //    return item.split('"')[1] || null;
    //}).filter(function (item) {
    //    return (item && String(item).indexOf('.') !== 0)
    //});
    //
    //var combined = temp1.concat(temp2);

    var requires = detective(src);

    requires = (requires || []).filter(function(item){
        return item && String(item).indexOf('.') !== 0;
    });

    (requires || []).forEach(function (item) {
        if (!_.contains(dependencyArray, item) && !_.contains(coreModules, item)) {
            errors.push('package.json does not contain: ' + item);
            statements.push('package.json does not contain: ' + item);
        }
    });

    if (statements.length > 0) {
        console.log(colors.red(filePath));
        for (var i = 0; i < statements.length; i++) {
            console.log(statements[i]);
        }
        console.log('\n');
    }

}


function start(options) {

    opts = options || {};

    var rootPath = appRoot.path;

    ignoreDirs = opts.ignoreDirs || [];
    ignorePaths = opts.ignorePaths || [];

    ignorePaths = ignorePaths.map(function (item) {
        return String(path.resolve(path.normalize(rootPath + '/' + item)));
    });

    var packageDotJSON = require(path.resolve(rootPath + '/' + 'package.json'));

    dependencyArray = Object.keys(packageDotJSON.dependencies);
    devDependencyArray = Object.keys(packageDotJSON.devDependencies || {});

    if (opts.verbose) {
        console.log('\n dependencies in package.json', colors.green(dependencyArray), '\n\n');
    }

    getAllFilesFromFolder(rootPath);

    if(errors.length > 0){
        return new Error(errors.join('\n'));
    }
    else{
        return null;
    }

}


module.exports = {

    start: start

};