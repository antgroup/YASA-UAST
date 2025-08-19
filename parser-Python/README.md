## 构建
```
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
pip3 install pyinstaller
pyinstaller --onefile --paths .venv/lib/python3.13/site-packages ./uast/builder.py
```