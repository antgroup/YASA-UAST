import 'mocha';
import * as assert from 'assert';
import { parse } from '../src/frontend/javascript/parser';
import * as fs from 'fs';
import * as path from 'path';
import * as globby from 'fast-glob';

// 获取当前版本：优先使用环境变量，否则 fallback 到 package.json
function getCurrentVersion(): string {
  return process.env.UAST_VERSION || require('../package.json').version;
}

// 动态替换 AST 中的 sourcefile 和 version 字段，避免 baseline 混入机器绝对路径。
function normalizeAst(ast: any, stableSourceFile: string, currentVersion: string): any {
  if (!ast || typeof ast !== 'object') return ast;

  const cloned = Array.isArray(ast) ? [...ast] : { ...ast };

  for (const key in cloned) {
    if (Object.prototype.hasOwnProperty.call(cloned, key)) {
      // 替换 sourcefile 为当前环境的真实路径
      if (key === 'sourcefile' && typeof cloned[key] === 'string') {
        cloned[key] = stableSourceFile;
      }
      // 替换 version 为当前版本
      else if (key === 'version' && typeof cloned[key] === 'string') {
        cloned[key] = currentVersion;
      }
      // 删除空的 uri 字段（可选）
      else if (key === 'uri' && cloned[key] === '') {
        delete cloned[key];
      }
      // 递归处理子节点
      else {
        cloned[key] = normalizeAst(cloned[key], stableSourceFile, currentVersion);
      }
      // 删除 _meta._extra.start/end（避免字节偏移差异）
      if (key === '_meta' && cloned[key]?.['_extra']?.hasOwnProperty('start')) {
        const extra = { ...cloned[key]['_extra'] };
        delete extra.start;
        delete extra.end;
        cloned[key] = { ...cloned[key], _extra: extra };
      }
    }
  }
  return cloned;
}

// 用于开发者更新 baseline（会写入当前版本）
function refreshUastJson() {
  const BASE_DIR = path.join(__dirname, 'benchmark', 'base');
  const jsFiles = globby.sync('*.js', { cwd: BASE_DIR });
  const currentVersion = getCurrentVersion();

  console.log(`🔄 Refreshing UAST baselines with version: ${currentVersion}`);

  for (const file of jsFiles) {
    const fullPath = path.join(BASE_DIR, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    const ast = parse(content, { sourcefile: file, language: 'javascript' });

    // ✅ 写入当前版本
    ast.version = currentVersion;

    fs.writeFileSync(`${fullPath}.json`, JSON.stringify(ast, null, 2), 'utf8');
    console.log(`✅ Updated baseline: ${file}.json`);
  }

  console.log('✅ All baselines updated.');
}

// 检查是否是刷新模式
function shouldRefresh(): boolean {
  return process.argv.includes('--refresh') || process.argv.includes('-r');
}

// 主测试逻辑
describe('benchmark for javascript', () => {
  const BASE_DIR = path.join(__dirname, 'benchmark', 'base');
  const jsFiles = globby.sync('*.js', { cwd: BASE_DIR });
  const currentVersion = getCurrentVersion();

  // 如果是刷新模式，只更新 baseline
  if (shouldRefresh()) {
    before(() => {
      refreshUastJson();
      process.exit(0);
    });
    return;
  }

  // 正常测试流程
  for (const jsFile of jsFiles) {
    it(jsFile, () => {
      const fullPath = path.join(BASE_DIR, jsFile);
      const content = fs.readFileSync(fullPath, 'utf8');

      // 实际解析结果
      const actual = parse(content, {
        sourcefile: fullPath,
        language: 'javascript',
      });

      // 读取 baseline
      const baselinePath = `${fullPath}.json`;
      let expected: any;
      try {
        const baselineRaw = fs.readFileSync(baselinePath, 'utf8');
        expected = JSON.parse(baselineRaw);
      } catch (err) {
        assert.fail(`❌ Failed to read baseline ${baselinePath}: ${err}`);
      }

      // ✅ 标准化：替换 sourcefile 和 version，移除 _extra.start/end
      const normalizedExpected = normalizeAst(expected, jsFile, currentVersion);
      const normalizedActual = normalizeAst(actual, jsFile, currentVersion);

      // 字符串化对比（格式化一致）
      const actualStr = JSON.stringify(normalizedActual, null, 2);
      const expectedStr = JSON.stringify(normalizedExpected, null, 2);

      // 断言
      assert.strictEqual(
        actualStr,
        expectedStr,
        `UAST mismatch in ${jsFile}\n\n👉 Run with --refresh to update baselines if changes are expected.`
      );
    });
  }
});
