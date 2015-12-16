#! /usr/local/bin/node

console.log('argv:',process.argv);

var path = require('path');
var ndc = require('./index');

var dir = process.cwd();

var config = null;
var configPath = null;

var args = process.argv.slice(2);

console.log('args:',args);

if(args.indexOf('--conf') > -1){
    configPath = args[args.indexOf('--conf') + 1];
    if(!configPath || configPath.length < 1){
        throw new Error('You passed the --conf option at the command line, but that option was not followed by a path');
    }
}
else{
    console.log('No config path passed at command line, looking for a ndc.conf.js file in the working directory...');
}

if(configPath){
    try{
        config = require(path.resolve(dir + '/' + 'ndc.conf.js'));
    }
    catch(err){
        console.error(err.message);
        throw new Error('No ndc.conf.js file could be found at the root of your project - are you in the right directory?')
    }
}
else{
    try{
        config = require(path.resolve(dir + '/' + 'ndc.conf.js'));
    }
    catch(err){
        console.error(err.message);
        throw new Error('No ndc.conf.js file could be found at the root of your project - are you in the right directory?')
    }

}


ndc.run(config);