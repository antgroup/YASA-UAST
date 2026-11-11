'use strict';

const assert = require('node:assert/strict');
const { readdirSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { isDeepStrictEqual } = require('node:util');
const { gunzipSync } = require('node:zlib');
const { Parser } = require('../dist');

const fixture = path.join(__dirname, 'fixtures', 'requests');
const sources = path.join(fixture, 'src', 'requests');
const snapshots = path.join(fixture, 'expected', 'tree-sitter');
const files = [
    '__init__.py', '__version__.py', '_internal_utils.py', '_types.py', 'adapters.py',
    'api.py', 'auth.py', 'certs.py', 'compat.py', 'cookies.py', 'exceptions.py',
    'help.py', 'hooks.py', 'models.py', 'packages.py', 'sessions.py',
    'status_codes.py', 'structures.py', 'utils.py',
].sort();

test('Requests project: Tree-sitter UAST matches saved snapshots', async (t) => {
    assert.deepEqual(readdirSync(sources).filter((name) => name.endsWith('.py')).sort(), files);
    assert.deepEqual(
        readdirSync(snapshots).filter((name) => name.endsWith('.json.gz')).sort(),
        files.map((name) => name.replace(/\.py$/, '.json.gz')).sort()
    );

    const parser = new Parser();
    await parser.init();
    for (const name of files) {
        await t.test(name, () => {
            const source = readFileSync(path.join(sources, name), 'utf8');
            const actual = JSON.parse(JSON.stringify(parser.parse(source, { sourcefile: name })));
            const expected = JSON.parse(gunzipSync(readFileSync(
                path.join(snapshots, name.replace(/\.py$/, '.json.gz'))
            )).toString('utf8'));
            assert.ok(isDeepStrictEqual(actual, expected), `${name}: UAST differs from the saved snapshot`);
        });
    }
});
