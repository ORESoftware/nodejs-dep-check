
# nodejs-dep-check

<br>
<br>

<a href="https://nodei.co/npm/nodejs-dep-check/"><img src="https://nodei.co/npm/nodejs-dep-check.png?downloads=true&downloadRank=true&stars=true"></a>

<br>


## installation

```bash
$ npm install -D nodejs-dep-check
```

### description

this module checks to see if all the dependencies in your code are reflected in ```package.json``` - you may have noticed that when you deploy code the build sometimes fails, or worse, after you deploy there's a runtime error because a require statement in your code references a dependency that didn't make into package.json for whatever reason.

therefore, ndc (nodejs-dep-check) should be incorporated in your continuous integration tests - this module is designed to be used as a static analysis test

you probably won't want this module for anything but testing, so you can use the ```--save-dev``` option instead of ```--save``` when
installing with NPM


## how to use

### from the command line:

```
$ n-dc 

or

$ n-dc --conf path/to/ndc.conf.js --pkg.json path/to/package.json
```

### use from anywhere in Node.js:


```js
var ndc = require('nodejs-dep-check');

ndc.run({
    verbose:true,                             // prints more output, true is default, set this to false for less output at command line
    ignoreModules: ['colors/safe'],           // use this option to override the errors for a particular module, e.g. colors/safe is something this module doesn't currently handle
    ignorePaths: ['./node_modules','./scripts/someOldScript.js'],  // ignore specific paths, *not all* directories with this name, just the exact path you specify which is relative to the root of your node.js project
    ignoreDirs: ['node_modules','test']       // ignore all contents and subcontents in *any* dir called "node_modules" or "test" or whatever
});
```

note: you can ignore specific files by using either the ignoreDirs or ignorePaths options, just use '.js' with the filename


### usage with Mocha

```js

 describe('@test-dep-check', function () {

 
     it('[test]', function (done) {
 
         var ndc = require('nodejs-dep-check');
 
         var result = ndc.run({
             verbose: true,
             ignorePaths: ['./node_modules'],       //in this case, this is redundant, because having node_modules in ignoreDirs has us covered
             ignoreDirs: ['node_modules', 'test'],
             ignoreModules: ['colors/safe']
         });
         
         done(result);   // Mocha will handle the test case for you, because nodejs-dep-check.run() returns an instance of Error if any check fails
 
     });
 
 });
 
```

It's probably best used with a testing framework like Mocha, but you can also use it from the command line.

Caveats:

(1) Make sure the CWD is the root of your project (aka, you issue the node or mocha command where your package.json file is)
(2) This module unfortunately cannot help you with dynamically resolved require calls (aka, require(path.resolve('foo' + '/bar')))

This module is configured by default to look at your entire project, so it always starts recursively with the root of your app.

here's typical output - you might notice that there is a line commented out

```
//var redis = require('redis');
```

this library doesn't ignore commented out lines - so you may wish to alter the comment into this:

```
//var redis = require#('redis'); (or whatever non-alpha-numeric character suits your fancy)
```

any questions you can open an issue thanks
