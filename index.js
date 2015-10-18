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

function hasUppercaseCase(str) {
    return (/[A-Z]/.test(str));
}

//var regex = new RegExp(/\srequire[^//]/g);

var regex = /[^a-zA-Z0-9]require\(([^)]+)\)/g;


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
var ignoreModules = null;
var errors = [];


var getAllFilesFromFolder = function (dir) {

    var stat = null;

    fs.readdirSync(dir).forEach(function (file) {

        if (_.contains(ignoreDirs, file)) {

            if (opts.verbose) {
                console.log(colors.yellow('[nodejs-dep-check] (ignore dir option) ignored this path:'), dir + '/' + file);
            }

        }
        else {

            file = path.resolve(path.normalize(dir + '/' + file));

            if (_.contains(ignorePaths, file)) {
                if (opts.verbose) {
                    console.log(colors.yellow('[nodejs-dep-check] (ignore path option) ignored this path:'), dir + '/' + file);
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
                    console.log('[nodejs-dep-check] warning: no stat');
                }
            }
        }
    });
};

function analyzeFile(filePath) {

    var statements = [];

    var src = fs.readFileSync(filePath);

    var arrMatches = String(src).match(regex);

    var temp1 = (arrMatches || []).map(function (item) {
        return item.split("\'")[1] || null;
    });

    var temp2 = (arrMatches || []).map(function (item) {
        return item.split('"')[1] || null;
    })

    var combined = (temp1.concat(temp2)).filter(function (item) {
        return (item && String(item).indexOf('.') !== 0)
    });

    //var requires = detective(src);
    //
    //requires = (requires || []).filter(function(item){
    //    return item && String(item).indexOf('.') !== 0;
    //});

    combined.forEach(function (item) {
        if (!_.contains(dependencyArray, item) && !_.contains(coreModules, item) && !_.contains(ignoreModules,item)) {
            errors.push('package.json does not contain: ' + item + ' in file (' + filePath + ')');
        }
        if(!_.contains(ignoreModules,item) && hasUppercaseCase(item)){
            errors.push('dependency has uppercase character(s): ' + item + ' in file (' + filePath + ')');
        }
    });

    if (errors.length > 0) {
        console.log(colors.red(filePath));
        for (var i = 0; i < statements.length; i++) {
            if(opts.verbose){
                console.log('[nodejs-dep-check]' + statements[i]);
            }
        }
        console.log('\n');
    }

}


function start(options) {

    opts = options || {};

    var rootPath = appRoot.path;

    ignoreDirs = opts.ignoreDirs || [];
    ignorePaths = opts.ignorePaths || [];
    ignoreModules = opts.ignoreModules || [];

    ignorePaths = ignorePaths.map(function (item) {
        return String(path.resolve(path.normalize(rootPath + '/' + item)));
    });

    var packageDotJSON = require(path.resolve(rootPath + '/' + 'package.json'));

    dependencyArray = Object.keys(packageDotJSON.dependencies);
    devDependencyArray = Object.keys(packageDotJSON.devDependencies || {});

    if (opts.verbose) {
        console.log('\n','[nodejs-dep-check] dependencies in package.json:', colors.green(dependencyArray),'\n');
    }

    getAllFilesFromFolder(rootPath);

    if(errors.length > 0){
        return new Error(errors.join('\n\t'));
    }
    else{
        return null;
    }

}


module.exports = {

    start: start

};