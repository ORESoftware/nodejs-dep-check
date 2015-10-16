/**
 * Created by amills001c on 10/15/15.
 */


var ndc = require('../index.js');

ndc.start({
    verbose:true,
    ignorePaths: ['/node_modules/'],
    ignoreDirs: ['node_mxodules','txest']
});