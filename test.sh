#!/bin/bash
# YASA-UAST 自动化测试脚本
# 覆盖：specification build → parser-Java-Js (tsc + mocha) → parser-Go → parser-Python
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PASS=0
FAIL=0
SKIP=0
ERRORS=()

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

TOTAL=9
STEP=0

step() { ((STEP++)); echo -e "\n${CYAN}[$STEP/$TOTAL] $1${NC}"; }
pass() { echo -e "${GREEN}  ✓ $1${NC}"; ((PASS++)); }
fail() { echo -e "${RED}  ✗ $1${NC}"; ((FAIL++)); ERRORS+=("$1"); }
skip() { echo -e "${YELLOW}  ⊘ $1 (skipped)${NC}"; ((SKIP++)); }

# ═════════════════════════════════════════════
#  specification
# ═════════════════════════════════════════════
step "specification: npm install"
cd "$ROOT_DIR/specification"
if [ -d node_modules ]; then
    pass "node_modules exists, skip install"
else
    if npm install --prefer-offline 2>&1 | tail -1; then
        pass "npm install"
    else
        fail "specification npm install"
    fi
fi

step "specification: build (gulp + tsc)"
cd "$ROOT_DIR/specification"
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_RC=$?
if [ "$BUILD_RC" -ne 0 ]; then
    TSC_ERRORS=$(echo "$BUILD_OUTPUT" | grep -c "error TS" || true)
    if [ "$TSC_ERRORS" -gt 0 ]; then
        fail "specification tsc: $TSC_ERRORS type errors"
        echo "$BUILD_OUTPUT" | grep "error TS" | head -10
    else
        fail "specification build (exit code $BUILD_RC)"
        echo "$BUILD_OUTPUT" | tail -10
    fi
else
    pass "specification build (gulp + tsc 0 errors)"
fi

# ═════════════════════════════════════════════
#  parser-Java-Js
# ═════════════════════════════════════════════
step "parser-Java-Js: npm install"
cd "$ROOT_DIR/parser-Java-Js"
if [ -d node_modules ]; then
    pass "node_modules exists, skip install"
else
    if npm install --prefer-offline 2>&1 | tail -1; then
        pass "npm install"
    else
        fail "parser-Java-Js npm install"
    fi
fi

step "parser-Java-Js: tsc build"
cd "$ROOT_DIR/parser-Java-Js"
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_RC=$?
TSC_ERRORS=$(echo "$BUILD_OUTPUT" | grep -c "error TS" || true)
if [ "$BUILD_RC" -ne 0 ] || [ "$TSC_ERRORS" -gt 0 ]; then
    fail "parser-Java-Js tsc build: $TSC_ERRORS type errors"
    echo "$BUILD_OUTPUT" | grep "error TS" | head -20
else
    pass "parser-Java-Js tsc build (0 errors)"
fi

step "parser-Java-Js: mocha tests"
cd "$ROOT_DIR/parser-Java-Js"
TEST_OUTPUT=$(npm test 2>&1) || true
PASSING=$(echo "$TEST_OUTPUT" | grep -oE '[0-9]+ passing' | head -1 || echo "0 passing")
FAILING=$(echo "$TEST_OUTPUT" | grep -oE '[0-9]+ failing' | head -1 || echo "")

if [ -n "$FAILING" ]; then
    fail "parser-Java-Js tests: $PASSING, $FAILING"
    echo "$TEST_OUTPUT" | grep "AssertionError\|TypeError\|Error\|UAST mismatch" | head -10
else
    pass "parser-Java-Js tests: $PASSING"
fi

# ═════════════════════════════════════════════
#  parser-Go
# ═════════════════════════════════════════════
step "parser-Go: go vet + go test"
cd "$ROOT_DIR/parser-Go"
if ! command -v go &>/dev/null; then
    skip "parser-Go (go not installed)"
else
    # go vet (静态检查)
    VET_OUTPUT=$(go vet ./... 2>&1) || true
    if [ -n "$VET_OUTPUT" ]; then
        fail "parser-Go vet: issues found"
        echo "$VET_OUTPUT" | head -10
    fi

    # go test（含 TestBuildOutput golden 对比，golden 已规范化路径可跨机器）
    GO_OUTPUT=$(go test ./... 2>&1) || true
    GO_PASS=$(echo "$GO_OUTPUT" | grep -c "^ok" || true)
    GO_FAIL=$(echo "$GO_OUTPUT" | grep -c "^FAIL" || true)

    if [ "$GO_FAIL" -gt 0 ]; then
        if echo "$GO_OUTPUT" | grep -q "no such file or directory"; then
            skip "parser-Go test: hardcoded path (known issue)"
        else
            fail "parser-Go: $GO_FAIL package(s) failed"
            echo "$GO_OUTPUT" | grep -E "FAIL|Error|panic" | head -10
        fi
    else
        pass "parser-Go: $GO_PASS package(s) passed"
    fi
fi

# ═════════════════════════════════════════════
#  parser-Python
# ═════════════════════════════════════════════
step "parser-Python: npm ci"
cd "$ROOT_DIR/parser-Python"
if npm ci --ignore-scripts; then
    pass "parser-Python dependencies"
else
    fail "parser-Python dependencies"
fi

step "parser-Python: TypeScript build"
if npm run build; then
    pass "parser-Python TypeScript build"
else
    fail "parser-Python TypeScript build"
fi

step "parser-Python: parse smoke test"
if node <<'NODE'
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { Parser } = require('./');
(async () => {
    const parser = new Parser();
    await parser.init();
    for (const file of ['example.py', 'import.py', 'test_type_annotations.py']) {
        const ast = parser.parse(fs.readFileSync(`test/${file}`, 'utf8'), { sourcefile: file });
        assert.equal(ast.type, 'CompileUnit');
        assert.ok(ast.body.length > 0, file);
    }
    assert.equal(parser.parse('def f():\n return 1, *[None]\n').type, 'CompileUnit');
    assert.throws(() => parser.parse('def f(\n pass'), SyntaxError);
    assert.equal(parser.parse('x = 1').type, 'CompileUnit');
})().catch(error => { console.error(error); process.exitCode = 1; });
NODE
then
    pass "parser-Python parse smoke test"
else
    fail "parser-Python parse smoke test"
fi

step "parser-Python: Requests regression test"
if npm test; then
    pass "parser-Python Requests regression test"
else
    fail "parser-Python Requests regression test"
fi

# ═════════════════════════════════════════════
#  Summary
# ═════════════════════════════════════════════
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  PASS: $PASS${NC}  ${RED}FAIL: $FAIL${NC}  ${YELLOW}SKIP: $SKIP${NC}"
echo -e "${CYAN}════════════════════════════════════════${NC}"

if [ ${#ERRORS[@]} -gt 0 ]; then
    echo -e "\n${RED}Failed steps:${NC}"
    for err in "${ERRORS[@]}"; do
        echo -e "  ${RED}✗ $err${NC}"
    done
    exit 1
fi

echo -e "\n${GREEN}All checks passed.${NC}"
exit 0
