import 'mocha';
import { parse } from '../src/frontend/javascript/parser'
import * as fs from 'fs'
import * as path from 'path'

function walk(dir: string, callback: any) {
    fs.readdir(dir, function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {

            const filepath: string = path.join(dir, file);
            fs.stat(filepath, function (err, stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback);
                } else if (stats.isFile()) {
                    callback(filepath, stats);
                }
            });
        });
    });
}

describe('for preparing benchmark json', () => {
    const filename = 'demo.ts';
    it(`output ${filename}`, () => {
        try {
            const content = fs.readFileSync(path.join(__dirname, `/benchmark/base/${filename}`), 'utf8');
            // fs.writeFileSync(path.join(__dirname, `test.json`), JSON.stringify(parse(content), null, 2), 'utf8');
            console.log(JSON.stringify(parse(content), null, 2));
        } catch (e) {
            console.log(e)
        }
    });
});

describe('for preparing benchmark json 123', () => {
    const filename = 'parseerror.js';
    it(`output `, () => {
			let abc = 1;
	    ({['aaabbbccc']:abc} = {'aaabbbccc':2});
			console.log(abc)
    });
});


describe('for preparing uast from source code', () => {
  const filename = 'demo.ts';
  it(`output ${filename}`, () => {
    try {
      const content = `
       const a1 = [1,2,3]
       const a2 = [4,...a1,5]
      `
      let uast = parse(content)
      console.log(JSON.stringify(uast,null,2))
    } catch (e) {
      console.log(e)
    }
  });
});
