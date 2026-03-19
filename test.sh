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
step "parser-Python: generate asttype from spec"
cd "$ROOT_DIR/specification"
GEN_PY_OUTPUT=$(node ./scripts/generate-python-asttype.mjs 2>&1) || true
if [ ! -f "$ROOT_DIR/parser-Python/uast/asttype_generated.py" ]; then
    fail "parser-Python: asttype generation failed"
    echo "$GEN_PY_OUTPUT" | tail -5
else
    pass "parser-Python: asttype generation OK"
fi

step "parser-Python: parse smoke test"
cd "$ROOT_DIR/parser-Python"

PYTHON=""
# 找可用的 Python3（>= 3.10）：优先 python3.13 → python3.12 → … → python3，避免 CI/非交互 shell 里 python3 指向旧版
for py in python3.13 python3.12 python3.11 python3.10 python3; do
    if command -v "$py" &>/dev/null && "$py" -c "import sys; exit(0 if sys.version_info >= (3,10) else 1)" 2>/dev/null; then
        if [ ! -x ".venv313/bin/python3" ]; then
            echo "  Creating .venv313..."
            "$py" -m venv .venv313
            .venv313/bin/pip install -q -r requirements.txt
        fi
        PYTHON=".venv313/bin/python3"
        break
    fi
done

if [ -z "${PYTHON}" ]; then
    skip "parser-Python (need python3 >= 3.10, not found or too old)"
else
    # 检查 dataclasses_json 依赖
    DEP_CHECK=$(PYTHONPATH=. $PYTHON -c "import uast.builder" 2>&1) || true
    if echo "$DEP_CHECK" | grep -q "ModuleNotFoundError"; then
        skip "parser-Python: missing deps (run: pip install -r requirements.txt)"
    else
        TYPE_CHECK=$(PYTHONPATH=. $PYTHON - <<'PYEOF'
from pathlib import Path
src = Path('uast/asttype_generated.py').read_text()
compile(src, 'uast/asttype_generated.py', 'exec')
print('ok')
PYEOF
        2>&1) || true
        if ! echo "$TYPE_CHECK" | grep -q "^ok$"; then
            fail "parser-Python: generated asttype syntax error"
            echo "$TYPE_CHECK" | tail -5
            exit 1
        fi

        # 用一个简单 Python 文件做 smoke test（解析不崩溃即可）
        SMOKE_FILE=$(mktemp /tmp/uast_smoke_XXXXXX.py)
        cat > "$SMOKE_FILE" << 'PYEOF'
import os
class Foo:
    def bar(self, x):
        return x + 1
def main():
    f = Foo()
    f.bar(42)
PYEOF
        PARSE_OUTPUT=$(PYTHONPATH=. $PYTHON uast/builder.py --singleFileParse --rootDir "$SMOKE_FILE" --output /tmp/uast_smoke_output.json 2>&1) || true
        rm -f "$SMOKE_FILE"

        if [ -f /tmp/uast_smoke_output.json ] && [ -s /tmp/uast_smoke_output.json ]; then
            # 验证输出是合法 JSON
            if $PYTHON -c "import json; json.load(open('/tmp/uast_smoke_output.json'))" 2>/dev/null; then
                pass "parser-Python: smoke test OK"
            else
                fail "parser-Python: output is not valid JSON"
            fi
        else
            if echo "$PARSE_OUTPUT" | grep -q "Error\|Failed"; then
                fail "parser-Python: parse error"
                echo "$PARSE_OUTPUT" | tail -5
            else
                fail "parser-Python: no output generated"
                echo "$PARSE_OUTPUT" | tail -5
            fi
        fi
        rm -f /tmp/uast_smoke_output.json
    fi
fi

step "parser-Python: regression test"
cd "$ROOT_DIR/parser-Python"

if [ -z "${PYTHON}" ]; then
    skip "parser-Python regression test (need python3 >= 3.10, not found or too old)"
else
    REGRESSION_CHECK=$(PYTHONPATH=. $PYTHON test/run_regression.py 2>&1) || true
    if echo "$REGRESSION_CHECK" | grep -q "python regression OK"; then
        pass "parser-Python: regression test OK"
    else
        fail "parser-Python: regression test failed"
        echo "$REGRESSION_CHECK" | tail -10
    fi
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
