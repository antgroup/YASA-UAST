import ast
import argparse
import os
import warnings
import time
import multiprocessing
from concurrent.futures import ProcessPoolExecutor, as_completed
import uast.asttype as UNode
from uast.visitor import UASTTransformer

LANGUAGE = "python"
VERSION = "3.13"

warnings.simplefilter("ignore", category=SyntaxWarning)

def format_time(time_seconds, always_ms=False):
    """Format time in milliseconds or seconds
    
    Args:
        time_seconds: Time in seconds
        always_ms: If True, always format as milliseconds. If False, use seconds when >= 1.0
    
    Returns:
        str: Formatted time string (e.g., "15ms" or "1.23s")
    """
    if always_ms or time_seconds < 1.0:
        return f"{time_seconds*1000:.0f}ms"
    return f"{time_seconds:.2f}s"

def _parse_file_worker(args):
    """Worker function for parallel file parsing
    
    Args:
        args: tuple of (filepath, target_file, verbose)
    
    Returns:
        tuple: (filepath, elapsed_time, success, error_msg)
    """
    filepath, target_file, verbose = args
    start_time = time.time()
    success, error_msg = parse_single_file(filepath, target_file, verbose=True)  # 并行模式下设置为 verbose，不输出错误信息，由主进程统一输出
    elapsed_time = time.time() - start_time
    return (filepath, elapsed_time, success, error_msg)

def parse_project(dir, output_path, verbose=False, parallel=1):
    """ 解析project，主要用于 UAST 单独测试
    Args:
        dir: 根目录路径
        output_path: 输出结果路径
        verbose: 是否显示详细进度信息
        parallel: 并行处理数量，1 表示串行，>1 表示并行
    """
    # 先收集所有需要处理的文件
    files_to_process = []
    for root, dirs, files in os.walk(dir):
        [dirs.remove(d) for d in ['.venv', 'vendor', 'node_modules', 'site-packages'] if d in dirs]
        for file in files:
            if file.endswith('.py'):
                filepath = os.path.join(root, file)
                relativepath = os.path.relpath(filepath, start=dir)
                target_file = os.path.join(output_path, relativepath).replace(".py", ".json")
                os.makedirs(os.path.dirname(target_file), exist_ok=True)
                files_to_process.append((filepath, target_file))
    
    total_files = len(files_to_process)
    
    if total_files == 0:
        if verbose:
            print("No Python files found to process.")
        return
    
    # 记录总开始时间
    total_start_time = time.time()
    failed_count = 0
    
    # 统一使用并行处理（parallel=1 时相当于串行）
    max_workers = min(parallel, multiprocessing.cpu_count(), total_files)
    if verbose:
        print(f"Processing {total_files} files with {max_workers} workers...")
    
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        # 提交所有任务
        future_to_file = {
            executor.submit(_parse_file_worker, (filepath, target_file, verbose)): (index, filepath)
            for index, (filepath, target_file) in enumerate(files_to_process, 1)
        }
        
        # 处理完成的任务
        completed_count = 0
        for future in as_completed(future_to_file):
            index, filepath = future_to_file[future]
            try:
                result_filepath, elapsed_time, success, error_msg = future.result()
                completed_count += 1
                if not success:
                    failed_count += 1
                
                if verbose:
                    time_str = format_time(elapsed_time, always_ms=True)
                    status = "Completed" if success else "Failed"
                    msg = f"{status} {result_filepath} ({completed_count}/{total_files}) [elapsed: {time_str}]"
                    if not success:
                        msg += f" - {error_msg}"
                    print(msg)
                elif not success:
                    print(f"Error processing {result_filepath}: {error_msg}")
            except Exception as exc:
                completed_count += 1
                failed_count += 1
                error_msg = str(exc)
                if verbose:
                    print(f"File {filepath} generated an exception: {error_msg}")
                else:
                    print(f"Error processing {filepath}: {error_msg}")
    
    # 计算总耗时
    total_elapsed_time = time.time() - total_start_time
    total_time_str = format_time(total_elapsed_time)
    success_count = total_files - failed_count
    print(f"Processed {total_files} files. Success: {success_count}, Failed: {failed_count}, Total elapsed: {total_time_str}")

def parse_single_file(file, output_path, verbose=False):
    """ 解析单文件，主要用于YASA调用或者单文件 UAST 测试
    Args:
        file: 文件路径
        output_path: 输出结果路径
        verbose: 是否显示详细进度信息（verbose模式下不输出错误信息，由调用者统一输出）
    
    Returns:
        tuple: (success: bool, error_msg: str or None)
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
                    f.write(compile_unit.to_json(indent=None))
                return (True, None)
            except SyntaxError as e:
                error_msg = f"Syntax error in file {file}: {e}"
                if not verbose:
                    print(error_msg)
                with open(output_path, mode='w', encoding='utf-8') as f:
                    f.write(error_msg)
                return (False, error_msg)
            except Exception as e:
                error_msg = f"Error processing file {file}: {e}"
                if not verbose:
                    print(error_msg)
                with open(output_path, mode='w', encoding='utf-8') as f:
                    f.write(error_msg)
                return (False, error_msg)
    except UnicodeDecodeError as e:
        error_msg = f"UnicodeDecodeError in file {file}: {e}"
        if not verbose:
            print(error_msg)
        with open(output_path, mode='w', encoding='utf-8') as f:
            f.write(error_msg)
        return (False, error_msg)
    except Exception as e:
        error_msg = f"Unexpected error processing file {file}: {e}"
        if not verbose:
            print(error_msg)
        try:
            with open(output_path, mode='w', encoding='utf-8') as f:
                f.write(error_msg)
        except:
            pass
        return (False, error_msg)

def main():
    parser = argparse.ArgumentParser(description='Parse Python files to generate UAST.')
    # rootDir 参数，用于指定目录或文件路径
    parser.add_argument('--rootDir', type=str,
                        help='The root directory or single file path of the Python project')
    # singleFileParse 参数，用于决定是否解析单文件
    parser.add_argument('--singleFileParse', type=str, default="False",
                        help='Whether to parse a single file (default: False)')
    # output 参数，指定输出路径
    parser.add_argument('--output', type=str,
                        help='The output file path to save the UAST')
    # verbose 参数，显示详细进度信息
    parser.add_argument('-v', '--verbose', action='store_true',
                        help='Show detailed progress information for each file being processed')
    
    # parallel 参数，并行处理数量
    parser.add_argument('-j', '--parallel', type=int, default=1,
                        help='Number of parallel workers for processing files (default: 1)')
    
    args = parser.parse_args()
    root_dir = args.rootDir
    if args.singleFileParse == "True":
        single_file_parse = True
    elif args.singleFileParse == "False":
        single_file_parse = False
    else:
        raise ValueError(f"Error: {args.singleFileParse} should be True or False.")
    output_path = args.output
    verbose = args.verbose
    parallel = args.parallel
    
    # 验证 parallel 参数
    if parallel < 1:
        raise ValueError(f"Error: --parallel must be >= 1, got {parallel}")
    
    try:
        # 根据 singleFileParse 参数决定调用哪个函数
        if single_file_parse:
            # 单文件处理，验证是否为有效文件路径
            if os.path.isfile(root_dir):
                if verbose:
                    print(f"Analyzing {root_dir} (1/1)")
                start_time = time.time()
                file_success, error_msg = parse_single_file(root_dir, output_path, verbose=verbose)
                elapsed_time = time.time() - start_time
                if verbose:
                    time_str = format_time(elapsed_time, always_ms=True)
                    status = "Completed" if file_success else "Failed"
                    msg = f"{status} {root_dir} (1/1) [elapsed: {time_str}]"
                    if not file_success:
                        msg += f" - {error_msg}"
                    print(msg)
                # 非 verbose 模式下，parse_single_file 已经打印了错误信息
            else:
                raise ValueError(f"Error: {root_dir} is not a valid file path.")
        else:
            # 项目文件夹处理，验证是否为有效目录路径
            if os.path.isdir(root_dir):
                parse_project(root_dir, output_path, verbose=verbose, parallel=parallel)
            else:
                raise ValueError(f"Error: {root_dir} is not a valid directory path.")
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    main()

# ./dist/builder --rootDir="/Users/ariel/code/language-maturity-benchmark/xast-python/benchmark-python/case" --singleFileParse=False --output="/Users/ariel/code/uast/UAST4Python/output"
# pyinstaller --onefile --paths .venv/lib/python3.13/site-packages ./uast/builder.py