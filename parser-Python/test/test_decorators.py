import json
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from uast.builder import parse_single_file


def _parse(code):
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as source:
        source.write(code)
        source_path = source.name
    output_path = source_path + ".json"
    try:
        success, error = parse_single_file(source_path, output_path, verbose=True)
        assert success, error
        with open(output_path) as output:
            return json.load(output)
    finally:
        os.unlink(source_path)
        if os.path.exists(output_path):
            os.unlink(output_path)


def _nodes(value):
    if isinstance(value, dict):
        if "type" in value:
            yield value
        for child in value.values():
            yield from _nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from _nodes(child)


def test_meta_decorators_are_lists():
    result = _parse(
        "from dataclasses import dataclass\n"
        "@decorator\n"
        "def decorated():\n"
        "    pass\n"
        "@dataclass\n"
        "class Data:\n"
        "    value: int\n"
        "class Empty:\n"
        "    pass\n"
    )
    nodes = list(_nodes(result))
    assert nodes
    assert all(isinstance(node["_meta"]["decorators"], list) for node in nodes)

    functions = [node for node in nodes if node["type"] == "FunctionDefinition"]
    classes = [node for node in nodes if node["type"] == "ClassDefinition"]
    assert any(node["_meta"]["decorators"] for node in functions)
    assert any(node["_meta"]["decorators"] for node in classes)

    empty_class = next(node for node in classes if node["id"]["name"] == "Empty")
    synthetic_init = next(node for node in _nodes(empty_class) if node["type"] == "FunctionDefinition")
    assert synthetic_init["_meta"]["isConstructor"] is True
    assert synthetic_init["_meta"]["decorators"] == []

    data_class = next(node for node in classes if node["id"]["name"] == "Data")
    data_init = next(node for node in _nodes(data_class) if node["type"] == "FunctionDefinition")
    assert data_init["_meta"]["isConstructor"] is True
    assert data_init["_meta"]["decorators"] == []


if __name__ == "__main__":
    test_meta_decorators_are_lists()
    print("decorator metadata test passed")
