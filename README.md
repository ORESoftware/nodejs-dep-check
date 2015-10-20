
# nodejs-dep-check

Github repo: https://github.com/ORESoftware/nodejs-dep-check

(for some reason the Github link is not showing up on NPM)


## installation

```bash
$ npm install --save-dev nodejs-dep-check
```

### description

this module checks to see if all the dependencies in your code are reflected in package.json, before deploying projects to production

ndc (nodejs-dep-check) should be incorporated in continuous integration tests

you won't want this module for anything but testing, so you can use the --save-dev option instead of --save when
installing with NPM


## how to use

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
 
     var assert = require('assert');
 
     it('[test]', function (done) {
 
         var ndc = require('nodejs-dep-check');
 
         var result = ndc.run({
             verbose: true,
             ignorePaths: ['./node_modules'],       //in this case, this is redundant, because having node_modules in ignoreDirs has us covered
             ignoreDirs: ['node_modules', 'test'],
             ignoreModules: ['colors/safe']
         });
 
         //assert(!(result instanceof Error)); //we could use assert like this but we don't need to, just pass the result to done
         
         done(result);
 
     });
 
 });
 
```

In the near future I will create make this runnable by command line, but for now, it's probably best used with a testing framework like Mocha.

Currently it's configured to look at your entire project, so it always starts recursively with the root of your app. I could provide an option to only search nested directories, but I am not
sure if there is demand for that, let me know.


any questions you can open an issue on Github or email me at alex@oresoftware.com, thanks
