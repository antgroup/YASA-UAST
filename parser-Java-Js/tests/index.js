"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var assert = require("assert");
var parser_1 = require("../src/frontend/javascript/parser");
var fs = require("fs");
var path = require("path");
var globby = require("fast-glob");
describe('benchmark for javascript', function () {
    var suffixMatch = ['*.js'];
    var jsFiles = globby.sync(suffixMatch, { cwd: path.join(__dirname, '/benchmark/base') });
    var _loop_1 = function (jsFile) {
        it(jsFile, function () {
            var content = fs.readFileSync(path.join(__dirname, '/benchmark/base', jsFile), 'utf8');
            var parsed = (0, parser_1.parse)(content, jsFile);
            var jsonContent = fs.readFileSync(path.join(__dirname, '/benchmark/base', jsFile + '.json'), 'utf8');
            var baseline = JSON.parse(jsonContent);
            assert.ok(deepEqual(parsed, baseline), jsFile);
        });
    };
    for (var _i = 0, jsFiles_1 = jsFiles; _i < jsFiles_1.length; _i++) {
        var jsFile = jsFiles_1[_i];
        _loop_1(jsFile);
    }
});
function deepEqual(obj1, obj2) {
    if (obj1 === obj2)
        return true;
    if ((typeof obj1 === 'object' && obj1 !== null) && (typeof obj2 === 'object' && obj2 !== null)) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length)
            return false;
        for (var prop in obj1) {
            if (Object.prototype.hasOwnProperty.call(obj2, prop)) {
                if (!deepEqual(obj1[prop], obj2[prop]))
                    return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}
