import json
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from uast.builder import parse_single_file


ACTUAL_ROOT = Path("/tmp/yasa-uast-py-regression")
SKIP_DIRS = {".venv", "vendor", "node_modules", "site-packages", "__pycache__"}
CASES = [
    {
        "name": "chatbot_backend",
        "source": ROOT / "test" / "chatbot_backend",
        "expected": ROOT / "test" / "chatbot_backend_expected",
    }
]


def normalize(path: Path, root: Path):
    data = json.loads(path.read_text())
    rel_src = path.relative_to(root).with_suffix(".py").as_posix()

    def walk(node):
        if isinstance(node, dict):
            for key, value in list(node.items()):
                if key == "sourcefile" and isinstance(value, str):
                    node[key] = rel_src
                else:
                    walk(value)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(data)
    return data


def collect_sources(root: Path):
    return sorted(
        path for path in root.rglob("*.py")
        if all(part not in SKIP_DIRS for part in path.parts)
    )


def run_case(case):
    src_root = case["source"]
    expected_root = case["expected"]
    actual_root = ACTUAL_ROOT / case["name"]

    if not expected_root.exists():
        return [f"{case['name']}: missing expected outputs"]

    files = collect_sources(src_root)
    expected_files = sorted(expected_root.rglob("*.json"))
    failures = []
    changed = []

    for src in files:
        rel = src.relative_to(src_root)
        actual = (actual_root / rel).with_suffix(".json")
        expected = (expected_root / rel).with_suffix(".json")
        actual.parent.mkdir(parents=True, exist_ok=True)

        ok, err = parse_single_file(str(src), str(actual), verbose=True)
        if not ok:
            failures.append(f"{case['name']}/{rel.as_posix()}: {err}")
            continue
        if not expected.exists():
            failures.append(f"{case['name']}/{rel.as_posix()}: missing expected json")
            continue
        if normalize(actual, actual_root) != normalize(expected, expected_root):
            changed.append(f"{case['name']}/{rel.as_posix()}")

    if len(expected_files) != len(files):
        failures.append(
            f"{case['name']}: expected file count mismatch: expected={len(expected_files)} actual_sources={len(files)}"
        )

    if changed:
        failures.extend(changed[:10])
    return failures


def main():
    if ACTUAL_ROOT.exists():
        shutil.rmtree(ACTUAL_ROOT)
    ACTUAL_ROOT.mkdir(parents=True, exist_ok=True)

    try:
        failures = []
        for case in CASES:
            failures.extend(run_case(case))

        if failures:
            print("python regression failed", file=sys.stderr)
            for item in failures[:20]:
                print(item, file=sys.stderr)
            return 1

        print(f"python regression OK ({len(CASES)} cases)")
        return 0
    finally:
        shutil.rmtree(ACTUAL_ROOT, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
