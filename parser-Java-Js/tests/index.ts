import 'mocha';
import * as assert from 'assert';
import { parse } from '../src/frontend/javascript/parser'
import * as fs from 'fs'
import * as path from 'path'
import * as globby from 'fast-glob';

function refreshUastJson() {
  const suffixMatch = ['*.js'];
  const jsFiles = globby.sync(suffixMatch, { cwd: path.join(__dirname, '/benchmark/base') });
  for (let file of jsFiles) {
    const content = fs.readFileSync(path.join(__dirname, '/benchmark/base', file), 'utf8');
    const ast = parse(content)
    fs.writeFileSync(path.join(__dirname,'/benchmark/base', `${file}.json`), JSON.stringify(ast, null, 2), 'utf8');
  }
}

// uastparser变更了以后，确认修改都对的情况下，使用tsc编译在yasa替换uastparser验证无误以后
// 需要重新生成baseline
// refreshUastJson()


describe('benchmark for javascript', () => {
    const suffixMatch = ['*.js'];
    const jsFiles = globby.sync(suffixMatch, { cwd: path.join(__dirname, '/benchmark/base') });
    for (const jsFile of jsFiles) {
        it(jsFile, () => {
            // fs.writeFileSync(path.join(__dirname, `test.json`), JSON.stringify(parse(content), null, 2), 'utf8');
            const content = fs.readFileSync(path.join(__dirname, '/benchmark/base', jsFile), 'utf8');
            const actual = parse(content,{sourcefile :path.join(__dirname, '/benchmark/base', jsFile),language:"javascript"});
            // console.log(JSON.stringify(parsed));
            // const filePath = path.join(__dirname, '/benchmark/base', jsFile + '.json');
            // fs.writeFile(filePath, JSON.stringify(actual,null,2), (err) => {
            //     if (err) {
            //         console.error('写入文件时发生错误:', err);
            //         return;
            //     }
            //     console.log('文件已成功写入:', filePath);
            // });
            const baselineJson = fs.readFileSync(path.join(__dirname, '/benchmark/base', jsFile + '.json'), 'utf8')
            // const baseline = JSON.parse(jsonContent);
            // assert.ok(deepEqual(parsed, baseline), jsFile);

            assert.strictEqual(JSON.stringify(actual,null,2),baselineJson,jsFile)
        });
    }
});

function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true

    if ((typeof obj1 === 'object' && obj1 !== null) && (typeof obj2 === 'object' && obj2 !== null)) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length)
            return false;

        for (const prop in obj1) {
            if (Object.prototype.hasOwnProperty.call(obj2, prop)) {
                if (!deepEqual(obj1[prop], obj2[prop]))
                    return false;
            }
        }
        return true;
    } else {
        return false;
    }
}
