import ast
import uast.asttype as UNode
import argparse
import os
import warnings
from uast.visitor import UASTTransformer

LANGUAGE = "python"
VERSION = "3.13"
warnings.simplefilter("ignore", category=SyntaxWarning)


def parse_project(dir, output_path):
    """ 解析project，主要用于 UAST 单独测试

    Args:
        dir: 根目录路径
        output_path: 输出结果路径
    """
    for root, dirs, files in os.walk(dir):
        [dirs.remove(d) for d in ['.venv', 'vendor', 'node_modules', 'site-packages'] if d in dirs]
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                relativepath = os.path.relpath(filepath, start=dir)
                target_file = os.path.join(output_path, relativepath).replace(".py", ".json")
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                parse_single_file(filepath, target_file)


def parse_single_file(file, output_path):
    """ 解析单文件，主要用于YASA调用或者单文件 UAST 测试

    Args:
        file: 文件路径
        output_path: 输出结果路径
    """
    try:
        with open(file, 'r', encoding='utf-8') as f:
            try:
                file_content = f.read()
                file_ast = ast.parse(file_content, filename=file)
                file_ast.sourcefile = file
                uastnode = UASTTransformer().visit(file_ast)
                compile_unit = UASTTransformer().packPos(file_ast, UNode.CompileUnit(UNode.SourceLocation(), UNode.Meta(), uastnode, LANGUAGE, None, None,
                                                 VERSION))
                compile_unit.loc.sourcefile = file
                with open(output_path, mode='w', encoding='utf-8') as f:
                    f.write(compile_unit.to_json())
            except SyntaxError as e:
                print(f"Syntax error in file {file}: {e}")
                with open(output_path, mode='w', encoding='utf-8') as f:
                    f.write(f"Syntax error in file {file}: {e}")
    except UnicodeDecodeError as e:
        print(f"UnicodeDecodeError in file {file}: {e}")
        with open(output_path, mode='w', encoding='utf-8') as f:
            f.write(f"Syntax error in file {file}: {e}")


def main():
    parser = argparse.ArgumentParser(description='Parse Python files to generate UAST.')

    # rootDir 参数，用于指定目录或文件路径
    parser.add_argument('--rootDir', type=str,
                        help='The root directory or single file path of the Python project')

    # singleFileParse 参数，用于决定是否解析单文件
    parser.add_argument('--singleFileParse', type=str,
                        help='Whether to parse a single file')

    # output 参数，指定输出路径
    parser.add_argument('--output', type=str,
                        help='The output file path to save the UAST')

    args = parser.parse_args()
    root_dir = args.rootDir
    if args.singleFileParse == "True":
        single_file_parse = True
    elif args.singleFileParse == "False":
        single_file_parse = False
    else:
        raise ValueError(f"Error: {args.singleFileParse} should be True or False.")
    output_path = args.output

    try:
        # 根据 singleFileParse 参数决定调用哪个函数
        if single_file_parse:
            # 单文件处理，验证是否为有效文件路径
            if os.path.isfile(root_dir):
                parse_single_file(root_dir, output_path)
            else:
                raise ValueError(f"Error: {root_dir} is not a valid file path.")
        else:
            # 项目文件夹处理，验证是否为有效目录路径
            if os.path.isdir(root_dir):
                parse_project(root_dir, output_path)
            else:
                raise ValueError(f"Error: {root_dir} is not a valid directory path.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()

# ./dist/builder --rootDir="/Users/ariel/code/language-maturity-benchmark/xast-python/benchmark-python/case" --singleFileParse=False --output="/Users/ariel/code/uast/UAST4Python/output"
# pyinstaller --onefile --paths .venv/lib/python3.13/site-packages ./uast/builder.py