
# requirejs-metagen

### installation

npm install --save nodejs-dep-check

### description

check to see if all dependencies are in package.json, before deploying projects to production

ndc (nodejs-dep-check) should be incorporated in continuous integration tests


## how to use

```js
var ndc = require('nodejs-dep-check');

ndc.start({
    verbose:true,                                  //prints more output, true is default, set to false for less output at command line
    ignoreModules: ['colors/safe'],                //use this option to override the errors for a particular module, e.g. colors/safe is something this module doesn't currently handle
    ignorePaths: ['/node_modules/'],               //ignore specific paths, but not all directories with this name, just the one path
    ignoreDirs: ['node_modules','test']            //ignore all contents and subcontents in any dir called "node_modules" or "test"
});
```

usage with Mocha

```js

 describe('@test-dep-check', function () {
 
     var assert = require('assert');
 
     it('[test]', function (done) {
 
         var ndc = require('nodejs-dep-check');
 
         var result = ndc.run({
             verbose: true,
             ignorePaths: ['/node_modules/'],
             ignoreDirs: ['node_modules', 'test'],
             ignoreModules: ['colors/safe']
         });
 
         //assert(!(result instanceof Error)); //we could use assert like this but we don't need to, just pass the result to done
         
         done(result);
 
     });
 
 });
 
```

in the near future I will create make this runnable by command line, but for now, it's probably best used with a testing framework like Mocha.

right now it's configured to look at your entire project, so it always starts recursively with the root of your app. I could provide an option to only search nested directories, but I am not
sure if there is demand for that, let me know.


any questions you can open an issue on Github or email me at alex@oresoftware.com, thanks
