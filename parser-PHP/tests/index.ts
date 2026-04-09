import 'mocha';
import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import fastGlob from 'fast-glob';
import { init, parse } from '../src/parser';

function getCurrentVersion(): string {
    return process.env.UAST_VERSION || require('../package.json').version;
}

function normalizeAst(ast: any, currentSourceFile: string, currentVersion: string): any {
    if (!ast || typeof ast !== 'object') return ast;

    const cloned = Array.isArray(ast) ? [...ast] : { ...ast };

    for (const key in cloned) {
        if (!Object.prototype.hasOwnProperty.call(cloned, key)) continue;

        if (key === 'sourcefile' && typeof cloned[key] === 'string') {
            cloned[key] = currentSourceFile;
        } else if (key === 'version' && typeof cloned[key] === 'string') {
            cloned[key] = currentVersion;
        } else if (key === '_meta' && cloned[key]?.origin) {
            const meta = { ...cloned[key] };
            delete meta.origin;
            cloned[key] = normalizeAst(meta, currentSourceFile, currentVersion);
        } else {
            cloned[key] = normalizeAst(cloned[key], currentSourceFile, currentVersion);
        }
    }

    return cloned;
}

function refreshUastJson() {
    const baseDir = path.join(__dirname, 'benchmark', 'base');
    const phpFiles = fastGlob.sync('*.php', { cwd: baseDir });
    const currentVersion = getCurrentVersion();

    for (const file of phpFiles) {
        const fullPath = path.join(baseDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const ast = parse(content, { sourcefile: file });
        ast.version = currentVersion;
        fs.writeFileSync(`${fullPath}.json`, JSON.stringify(ast, null, 2), 'utf8');
    }
}

function shouldRefresh(): boolean {
    return process.argv.includes('--refresh') || process.argv.includes('-r');
}

if (shouldRefresh()) {
    init().then(() => {
        refreshUastJson();
        process.exit(0);
    });
} else {

describe('benchmark for php', () => {
    const baseDir = path.join(__dirname, 'benchmark', 'base');
    const phpFiles = fastGlob.sync('*.php', { cwd: baseDir });
    const currentVersion = getCurrentVersion();

    before(async () => {
        await init();
    });

    for (const phpFile of phpFiles) {
        it(phpFile, () => {
            const fullPath = path.join(baseDir, phpFile);
            const content = fs.readFileSync(fullPath, 'utf8');
            const actual = parse(content, { sourcefile: phpFile });
            const expected = JSON.parse(fs.readFileSync(`${fullPath}.json`, 'utf8'));

            const actualStr = JSON.stringify(normalizeAst(actual, phpFile, currentVersion), null, 2);
            const expectedStr = JSON.stringify(normalizeAst(expected, phpFile, currentVersion), null, 2);

            assert.strictEqual(actualStr, expectedStr, `UAST mismatch in ${phpFile}`);
        });
    }
});

} // end else (not refresh)
