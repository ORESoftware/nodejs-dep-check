/**
 * Created by amills001c on 10/15/15.
 */


var fs = require("fs");
var path = require('path');
var _ = require('underscore');
var appRoot = require('app-root-path');
var colors = require('colors');
var debug = require('debug')('ndc');


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function hasUppercaseCase(str) {
    return (/[A-Z]/.test(str));
}

//var regex = new RegExp(/\srequire[^//]/g);

var regex = /[^a-zA-Z0-9]require\(([^)]+)\)/g;

//var regex = /\srequire\(([^)]+)\)/g;

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
                console.log(colors.yellow('\n [nodejs-dep-check]'), colors.gray('"ignoreDir" option ignored this path:'), dir + '/' + file, '\n');
            }

        }
        else {

            file = path.resolve(path.normalize(dir + '/' + file));

            if (_.contains(ignorePaths, file)) {
                if (opts.verbose) {
                    console.log(colors.yellow('\n [nodejs-dep-check]'), colors.gray('"ignorePath" option) ignored this path:'), dir + '/' + file, '\n');
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

    var fileErrors = [];

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


    combined.forEach(function (item) {
        if (!_.contains(dependencyArray, item) && !_.contains(coreModules, item) && !_.contains(ignoreModules,item)) {
            fileErrors.push('package.json does not contain: ' + item);
        }
        if(!_.contains(ignoreModules,item) && hasUppercaseCase(item)){
            fileErrors.push('dependency string has uppercase character(s): "' + item + '"');
        }
    });

    if (fileErrors.length > 0) {
        if(opts.verbose) {
            console.log(colors.yellow('[nodejs-dep-check]'), colors.gray('this file has potential problems:'), colors.magenta(filePath));
        }
        for (var i = 0; i < fileErrors.length; i++) {
            if(opts.verbose){
                console.log(colors.yellow('[nodejs-dep-check] ') + colors.red(fileErrors[i]));
            }
        }
        console.log('\n');

        errors = errors.concat(fileErrors);
    }

}


function run(options) {

    opts = _.defaults((options || {}),{
           verbose:true
    });

    var rootPath = appRoot.path;

    ignoreDirs = opts.ignoreDirs || [];
    ignorePaths = opts.ignorePaths || [];
    ignoreModules = opts.ignoreModules || [];

    ignorePaths = ignorePaths.map(function (item) {
        return String(path.resolve(path.normalize(rootPath + '/' + item)));
    });

    var packageDotJSON = null;
    try{
        packageDotJSON = require(path.resolve(rootPath + '/' + 'package.json'));
    }
    catch(err){
        throw new Error('[nodejs-dep-check] no package.json file is found in the root of your project')
    }

    dependencyArray = Object.keys(packageDotJSON.dependencies);

    if(!dependencyArray){
        throw new Error('[nodejs-dep-check] no dependencies listed in package.json')
    }

    _.sortBy(dependencyArray, function (name) {return name}).reverse();

    devDependencyArray = Object.keys(packageDotJSON.devDependencies || {});

    if (opts.verbose) {
        console.log('\n',colors.yellow('[nodejs-dep-check] dependencies in package.json:'), colors.cyan(dependencyArray),'\n');
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

    run: run

};