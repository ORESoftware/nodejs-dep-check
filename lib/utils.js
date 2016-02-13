/**
 * Created by amills001c on 2/12/16.
 */

var path = require('path');
var fs = require('fs');

module.exports = {


    findRootPath: function findRoot(pth) {

        var possiblePkgDotJSONPath = path.resolve(path.normalize(String(pth) + '/package.json'));

        try {
            fs.statSync(possiblePkgDotJSONPath).isFile();
            return pth;
        }
        catch (err) {
            var subPath = path.resolve(path.normalize(String(pth) + '/../'));
            if (subPath === pth) {
                return null;
            }
            else {
                return findRoot(subPath);
            }
        }
    }


};