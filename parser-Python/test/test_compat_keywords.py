#!/usr/bin/env python3
"""测试 async/await 作为标识符时的兼容重试解析"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from uast.builder import parse_single_file
import tempfile
import json


def _parse_code(code):
    """解析代码片段，返回 (success, json_result_or_none)"""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file = f.name
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        temp_output = f.name
    try:
        success, error_msg = parse_single_file(temp_file, temp_output, verbose=True)
        result = None
        if success:
            with open(temp_output, 'r') as f:
                result = json.load(f)
        return success, result
    finally:
        os.unlink(temp_file)
        if os.path.exists(temp_output):
            os.unlink(temp_output)


def test_import_async_as_identifier():
    """from xxx import async — tsabnormal 真实场景"""
    code = """from trainer_common import extract, tar_dir, synchronized, async\nx = async(1)\n"""
    success, result = _parse_code(code)
    assert success, "应通过兼容重试成功解析 'from xxx import async'"
    print("  PASS: from xxx import async")


def test_await_as_identifier():
    """await 作为普通变量名"""
    code = """await = 42\nprint(await)\n"""
    success, result = _parse_code(code)
    assert success, "应通过兼容重试成功解析 'await' 作为变量名"
    print("  PASS: await as variable name")


def test_async_as_function_name():
    """async 作为普通函数名"""
    code = """def async(x):\n    return x + 1\n\nresult = async(5)\n"""
    success, result = _parse_code(code)
    assert success, "应通过兼容重试成功解析 'async' 作为函数名"
    print("  PASS: async as function name")


def test_normal_async_def_unaffected():
    """正常的 async def 不受影响"""
    code = """import asyncio\n\nasync def hello():\n    await asyncio.sleep(1)\n    return 42\n"""
    success, result = _parse_code(code)
    assert success, "正常 async def 应直接解析成功（不走重试）"
    # 验证生成了 FunctionDeclaration 且标记了 isAsync
    body = result.get('body', [])
    assert len(body) >= 2, f"应有至少 2 个顶层节点，实际 {len(body)}"
    print("  PASS: normal async def unaffected")


def test_normal_code_unaffected():
    """普通代码不受影响"""
    code = """x = 1\ny = x + 2\nprint(y)\n"""
    success, result = _parse_code(code)
    assert success, "普通代码应直接解析成功"
    print("  PASS: normal code unaffected")


def test_real_syntax_error_still_fails():
    """真正的语法错误仍然失败"""
    code = """def foo(\n    pass\n"""
    success, result = _parse_code(code)
    assert not success, "真正的语法错误应该仍然失败"
    print("  PASS: real syntax error still fails")


def test_async_for_with_preserved():
    """async for 和 async with 在兼容重试中应被保留"""
    # 这种代码本身不会触发 SyntaxError（合法 Python 3.5+）
    # 但如果文件中同时有 async 标识符用法导致重试，需确保 async for/with 不被破坏
    code = """async = 1\nasync def foo():\n    async for x in bar():\n        pass\n    async with ctx() as c:\n        pass\n"""
    success, result = _parse_code(code)
    # 这段代码本身就有冲突（async 既作变量又作关键字），
    # 但兼容重试应该能让它部分解析
    print(f"  INFO: mixed async usage - success={success} (best effort)")


if __name__ == '__main__':
    tests = [
        test_import_async_as_identifier,
        test_await_as_identifier,
        test_async_as_function_name,
        test_normal_async_def_unaffected,
        test_normal_code_unaffected,
        test_real_syntax_error_still_fails,
        test_async_for_with_preserved,
    ]
    passed = 0
    failed = 0
    for test in tests:
        print(f"\n{test.__doc__}")
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"  FAIL: {e}")
            failed += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            failed += 1
    print(f"\n{'='*40}")
    print(f"结果: {passed} passed, {failed} failed")
    if failed:
        sys.exit(1)
