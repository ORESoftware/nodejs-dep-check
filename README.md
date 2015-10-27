
# nodejs-dep-check


## installation

```bash
$ npm install --save-dev nodejs-dep-check
```

### description

this module checks to see if all the dependencies in your code are reflected in package.json - you may have noticed that when you deploy code the build fails
or after you deploy there's a runtime error because a require statement in your code referenced a dependency that didn't make into package.json for whatever reason.

therefore, ndc (nodejs-dep-check) should be incorporated in your continuous integration tests - this module is designed to be used as a static analysis test

you probably won't want this module for anything but testing, so you can use the --save-dev option instead of --save when
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

here's typical output - you might notice that there is line commented out

```
//var redis = require('redis');
```

this library cannot ignore commented out lines - you have to alter the comment into this:

```
//var redis = require#('redis'); (or whatever non-alpha-numeric character suits your fancy)
```

![alt tag](https://photos-1.dropbox.com/t/2/AAD3Pq7vaLPv3N1ZnrWzbDA5_Jb407aQTZKg7HFS8yn96w/12/76740618/png/32x32/1/1445979600/0/2/Screenshot%202015-10-27%2012.48.08.png/CIrwyyQgASACIAMgBSAHKAEoBw/_Kmbg4Gfzqx3qdKgJadBRw4DvTVhsYHwV1NxUhL4j3Y?size=1280x960&size_mode=2)

any questions you can open an issue on Github or email me at alex@oresoftware.com, thanks
