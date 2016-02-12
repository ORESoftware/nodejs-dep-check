/**
 * Created by amills001c on 10/15/15.
 */


var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var colors = require('colors');
var debug = require('debug')('ndc');


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function hasUppercaseCase(str) {
    return (/[A-Z]/.test(str));
}

var regex = /[^a-zA-Z0-9]require\(['|"]([^)]+)\)/g;   //look for require#('xyz') anywhere where it's not hi5require() or lolrequire() or require(path.resolve...)


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
    'querystring',
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
                console.log(colors.bold.gray('', '[nodejs-dep-check]'), colors.gray('"ignoreDir" option has disregarded this path:'), dir + '/' + file);
            }

        }
        else {

            file = path.resolve(path.normalize(dir + '/' + file));

            if (_.contains(ignorePaths, file)) {
                if (opts.verbose) {
                    console.log(colors.bold.grey('', '[nodejs-dep-check]'), colors.gray('"ignorePath" option has disregarded this path:'), file, '');
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
                    console.log(colors.bgRed('[nodejs-dep-check] warning: no stat'));
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
    });

    (temp1.concat(temp2)).filter(function (item) {

        return (item && String(item).indexOf('.') !== 0)

    }).forEach(function (item) {
        if (!_.contains(dependencyArray, item) && !_.contains(coreModules, item) && !_.contains(ignoreModules, item)) {
            fileErrors.push('package.json does not contain: ' + item);
        }
        if (!_.contains(ignoreModules, item) && hasUppercaseCase(item)) {
            fileErrors.push('dependency string has uppercase character(s): "' + item + '"');
        }
    });

    if (fileErrors.length > 0) {
        if (opts.verbose) {
            console.log('\n', colors.bold.gray('[nodejs-dep-check]'), colors.yellow('this file has potential problems:'), colors.black.bgYellow(filePath),'');
        }
        for (var i = 0; i < fileErrors.length; i++) {
            if (opts.verbose) {
                console.log('', colors.bold.gray('[nodejs-dep-check]'), colors.red(fileErrors[i]));
            }
        }
        errors = errors.concat(fileErrors);
    }

}


function run(options) {

    opts = _.defaults((options || {}), {
        verbose: true
    });

    var rootPath = process.cwd();

    ignoreDirs = opts.ignoreDirs || [];
    ignorePaths = opts.ignorePaths || [];
    ignoreModules = opts.ignoreModules || [];

    ignorePaths = ignorePaths.map(function (item) {
        return String(path.resolve(path.normalize(rootPath + '/' + item)));
    });

    var packageDotJSON = null;
    try {
        packageDotJSON = require(path.resolve(rootPath + '/' + 'package.json'));
    }
    catch (err) {
        throw new Error('[nodejs-dep-check] no package.json file is found in the root of your project')
    }

    dependencyArray = Object.keys(packageDotJSON.dependencies);

    if (!dependencyArray) {
        throw new Error('[nodejs-dep-check] no dependencies listed in package.json')
    }

    _.sortBy(dependencyArray, function (name) {
        return name
    }).reverse();

    devDependencyArray = Object.keys(packageDotJSON.devDependencies || {});

    console.log('\n', colors.bold.gray('[nodejs-dep-check]'), colors.gray('is starting run...dependencies declared in package.json are:'), colors.cyan(dependencyArray), '\n');


    getAllFilesFromFolder(rootPath);


    if (errors.length > 0) {
        var errs = _.uniq(errors).join('\n\t');
        console.log('\n',colors.bold.gray('[nodejs-dep-check]'),colors.bgRed('found problems with your project:') + '\n\t' + colors.red(errs),'');
        return new Error(errs);
    }
    else {
        console.log('\n',colors.bold.gray('[nodejs-dep-check]'),colors.black.bgGreen('found no problems with your project'),'');
        return null;
    }

}


module.exports = {

    run: run

};