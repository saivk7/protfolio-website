"use strict";
exports.__esModule = true;
exports.RecursiveFindDirectory = exports.printDir = void 0;
function printDir(arr, type) {
    var retarr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getType() === type) {
            retarr.push(arr[i].getName());
        }
    }
    return retarr;
}
exports.printDir = printDir;
var retArray = [];
function RecursiveFindDirectory(location, arr) {
    if (arr === null)
        return null;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].getLocation() !== location) {
            if (arr[i].getType() === 'directory') {
                RecursiveFindDirectory(location, arr[i].getFiles());
            }
        }
        else {
            retArray.push(arr[i]);
        }
    }
    return retArray;
}
exports.RecursiveFindDirectory = RecursiveFindDirectory;