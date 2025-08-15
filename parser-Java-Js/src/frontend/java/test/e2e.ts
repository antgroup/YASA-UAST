import fs from 'fs'
import path from 'path'
import * as parser from '../parser'
import * as UAST from '@ant-yasa/uast-spec';
import * as globby from "fast-glob";
import { parse } from "../../javascript/parser";
import assert from "assert";

describe('benchmark for java', () => {
    const suffixMatch = ['*.java'];
    const javaFiles = globby.sync(suffixMatch, { cwd: path.join(__dirname, '/examples') });
    for (const javaFile of javaFiles) {
        it(javaFile, () => {
            const sourcepath = path.join(__dirname, '/examples', javaFile);
            // fs.writeFileSync(path.join(__dirname, `test.json`), JSON.stringify(parse(content), null, 2), 'utf8');
            const content = fs.readFileSync(sourcepath, 'utf8');
            const actual = parser.parse(content.toString(), { sourcefile: sourcepath });
            // console.log(JSON.stringify(parsed));
            // const filePath = path.join(__dirname, '/examples', javaFile + '.json');
            // fs.writeFile(filePath, JSON.stringify(actual,null,2), (err) => {
            //     if (err) {
            //         console.error('写入文件时发生错误:', err);
            //         return;
            //     }
            //     console.log('文件已成功写入:', filePath);
            // });
            const baselineJson = fs.readFileSync(path.join(__dirname, '/examples', javaFile + '.json'), 'utf8')


            assert.strictEqual(JSON.stringify(actual,null,2),baselineJson,javaFile)
        });
    }
});

describe('#e2e test', function () {
    describe('#antlr4 example', function () {
        const files = getFilesInfo('/Users/jiufo/JavaProject/stc20');
        for (const file of files) {
            it(file.path, function () {
                const content = fs.readFileSync(file.path);
                try {
                    const ast = parser.parse(content.toString(), { sourcefile: file.path });
                    // console.log(JSON.stringify(ast, null, 2));
                } catch (e) {
                    throw e;
                }
            })
        }
    })
})

describe('#debug', function () {
    const path = 'src/frontend/java/test/examples/template.java';
    it(path, function () {
        const content = fs.readFileSync(path);
        const ast = parser.parse(content.toString(), { sourcefile: path });
        fs.writeFile('output.txt', JSON.stringify(ast, null, 2), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        // console.log(JSON.stringify(ast, null, 2));
        // console.log(UAST.prettyPrint(ast));
    })
})

function* getFilesInfo(folderPath: string, namespace: string = ''): Generator<{
    moduleName,
    isDirectory,
    namespace,
    path
}> {
    try {
        const files = fs.readdirSync(folderPath); // 读取文件夹中的所有文件和文件夹
        // 遍历每个文件和文件夹
        for (const file of files) {
            const fullPath = path.join(folderPath, file); // 获取文件（夹）的完整路径
            const stats = fs.statSync(fullPath); // 获取文件（夹）的状态信息

            if (stats.isDirectory()) {
                // yield { moduleName: file, isDirectory: true, namespace, path: fullPath }
                // 如果是文件夹，则递归遍历子文件夹
                if (namespace !== '') {
                    namespace += '.'
                }
                namespace += file;
                yield* getFilesInfo(fullPath, namespace);
            } else {
                if (path.extname(fullPath) === '.java') {
                    const moduleName = path.parse(fullPath).name
                    yield { moduleName, isDirectory: false, namespace, path: fullPath }
                }
            }
        }
    } catch (e) {
        return
    }

}
