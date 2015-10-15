/**
 * Created by amills001c on 10/15/15.
 */


var fs = require("fs");
var path = require('path');
var _ = require('underscore');
var appRoot = require('app-root-path');
var colors = require('colors');


function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

//var regex = new RegExp(/\srequire[^//]/g);

var regex = /[=|\s]require\(([^)]+)\)/g;


var dependencyArray = null;
var acceptableExtensions = ['.js', '.jsx', '.ts'];

var coreModules = ['fs'];

var ignoreDirs = ['node_modules'];


var getAllFilesFromFolder = function (dir) {

    var stat = null;

    fs.readdirSync(dir).forEach(function (file) {

        if (_.contains(ignoreDirs, file)) {

            console.log(colors.yellow('ignores:'), file);

        }
        else {

            file = dir + '/' + file;

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


    });

};

function analyzeFile(filePath) {

    var str = fs.readFileSync(filePath);

    console.log(colors.red(filePath));
    var arrMatches = String(str).match(regex);


    var temp1 = (arrMatches || []).map(function (item) {

        return item.split("\'")[1] || null;

    }).filter(function (item) {

        return (item && String(item).indexOf('.') !== 0)

    });


    var temp2 = (arrMatches || []).map(function (item) {

        return item.split('"')[1] || null;

    }).filter(function (item) {

        return (item && String(item).indexOf('.') !== 0)

    });

    var combined = temp1.concat(temp2);

    (combined || []).forEach(function (item) {

        if (!_.contains(dependencyArray, item)) {
            console.log('package.json does not contain:', item);
        }

    });


    console.log('\n');

}


function start() {

    var rootPath = appRoot.path;
    var packageDotJSON = require(path.resolve(rootPath + '/' + 'package.json'));

    dependencyArray = Object.keys(packageDotJSON.dependencies);
    console.log('\n', colors.green(dependencyArray), '\n\n');

    getAllFilesFromFolder(rootPath);

}


module.exports = {

    start: start

};