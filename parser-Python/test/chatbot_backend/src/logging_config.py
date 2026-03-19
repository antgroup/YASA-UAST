# _*_ conding : utf-8 _*_
# @Time : 2025/3/26 14:49 
# @Author : qinshaoshuai
# @File : logging_config
# @Project : chatbot_backend
import os
import logging
from logging.handlers import RotatingFileHandler
from datetime import datetime

class CustomFileHandler(RotatingFileHandler):
    def __init__(self, filename, maxBytes=0, backupCount=0, encoding=None, delay=0):
        # 在初始化时，为filename添加当前日期的时间戳
        base_filename, ext = os.path.splitext(filename)
        filename = f"{base_filename}_{datetime.now().strftime('%Y%m%d')}{ext}"
        super().__init__(filename, maxBytes=maxBytes, backupCount=backupCount, encoding=encoding, delay=delay)

    def doRollover(self):
        """
        Do a rollover; in this case, a date-based rollover with size limitation.
        """
        if self.stream:
            self.stream.close()
            self.stream = None
        current_time = datetime.now().strftime('%Y%m%d')
        self.baseFilename = f"{os.path.splitext(self.baseFilename)[0].rsplit('_', 1)[0]}_{current_time}.{self.extension}"
        super().doRollover()

# 设置日志目录和文件路径
log_dir = 'logs'
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

log_file = os.path.join(log_dir, 'app.log')

# 配置日志记录器
logger = logging.getLogger('flask_app')
logger.setLevel(logging.DEBUG)

# 创建自定义文件处理器，当日志文件大小超过 5MB 时，覆盖之前的日志内容
file_handler = CustomFileHandler(log_file, maxBytes=5 * 1024 * 1024, backupCount=1, encoding='utf-8')
file_handler.setLevel(logging.DEBUG)

# 创建好的日志格式器
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s - [NEW CONTENT]')
file_handler.setFormatter(formatter)

# 添加处理器到日志记录器
logger.addHandler(file_handler)

def configure_logging(app):
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logging.DEBUG)