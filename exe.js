#! /usr/local/bin/node

///////////////////////////////////////////////////////

const path = require('path');
const ndc = require('./index');
const utils = require('./lib/utils');

////////////////////////////////////////////////////////

const cwd = process.cwd();

var config, configPath;

var args = JSON.parse(JSON.stringify(process.argv)).slice(2);


if (args.indexOf('--cfg') > -1) {
    configPath = args[args.indexOf('--cfg') + 1];
    if (!configPath || configPath.length < 1) {
        throw new Error('You passed the --cfg option at the command line, but that option was not followed by a path');
    }
}
else {
    console.log('\n','=> No config path passed at command line, looking for a ndc.conf.js file in the working directory or project root...');
}

if (configPath) {
    try {
        var pth = path.resolve(cwd + '/' + configPath);
        config = require(pth);

    }
    catch (err) {
        console.error(err.message);
        throw new Error('No ndc.conf.js file could be found at the root of your project - are you in the right directory?')
    }
}
else {
    try {
        var pth = path.resolve(utils.findRootPath(cwd) + '/' + 'ndc.conf.js');
        config = require(pth);
        console.log(' => ndc.conf.js file found: ' + pth,'\n');
    }
    catch (err) {
        console.error(err.message);
        throw new Error('No ndc.conf.js file could be found at the root of your project - are you in the right directory?')
    }
}


ndc.run(config);