/**
 * Created by amills001c on 10/15/15.
 */


var ndc = require('../');

ndc.run({
    verbose:true,
    //ignorePaths: ['/node_modules/'],
    ignoreDirs: ['node_modules','test','requireThese.js','/ ']
});