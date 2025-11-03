## 构建

### 安装依赖
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 使用示例

解析项目目录：
```bash
python3 -m uast.builder --rootDir /path/to/project --output ./output -j16 -v
```

解析单文件：
```bash
python3 -m uast.builder --rootDir /path/to/file.py --output ./output.json --singleFileParse True -v
```

### 打包为可执行文件（可选）

使用命令行：
```bash
python -m venv .venv
source .venv/bin/activate
pip install pyinstaller
pip install -r requirements.txt
pyinstaller --onefile --paths .venv/lib/python3.13/site-packages ./uast/builder.py
```

使用现有的 spec 文件：
```bash
pip install pyinstaller
pyinstaller builder.spec
```

打包后的使用示例：
```bash
./dist/builder --rootDir="/path/to/project" --singleFileParse=False --output="/path/to/output"
```