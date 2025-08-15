"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var parser_1 = require("../src/frontend/javascript/parser");
var fs = require("fs");
var path = require("path");
function walk(dir, callback) {
    fs.readdir(dir, function (err, files) {
        if (err)
            throw err;
        files.forEach(function (file) {
            var filepath = path.join(dir, file);
            fs.stat(filepath, function (err, stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                }
                else if (stats.isFile()) {
                    callback(filepath, stats);
                }
            });
        });
    });
}
describe('for preparing benchmark json', function () {
    var filename = 'comment.js';
    it("output ".concat(filename), function () {
        try {
            var content = fs.readFileSync(path.join(__dirname, "/benchmark/base/".concat(filename)), 'utf8');
            fs.writeFileSync(path.join(__dirname, "test.json"), JSON.stringify((0, parser_1.parse)(content,{ sourcefile: "/Users/jiufo/yasaaaaa/uastparser_js/tests/benchmark/base/demo.ts",
              language: 'javascript'}), null, 2), 'utf8');
            console.log(JSON.stringify((0, parser_1.parse)(content,{ sourcefile: "/Users/jiufo/yasaaaaa/uastparser_js/tests/benchmark/base/demo.ts",
              language: 'javascript'}), null, 2));
        }
        catch (e) {
            console.log(e);
        }
    });
});
