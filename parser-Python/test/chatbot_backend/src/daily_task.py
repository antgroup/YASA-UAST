# import time
# import schedule
import logging
import os
import sys
from pathlib import Path

ROOT_PATH = Path(__file__).parents[1]
sys.path.append(str(ROOT_PATH))

from app_service import store_question_embeddings

logger = logging.getLogger('Daily Task Logger')
logger.setLevel(logging.DEBUG)

log_path = os.path.join(ROOT_PATH, 'log/daily_task.log')
file_handler = logging.FileHandler(log_path)
file_handler.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

formatter = logging.Formatter('[%(asctime)s][%(name)s] %(levelname)s in %(filename)s: %(message)s')
file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(console_handler)

if __name__ == '__main__':
    # Alipay+
    store_question_embeddings(logger)
    # PDS
    store_question_embeddings(
        logger,
        log_question_table=os.getenv('DBTABLE_PDS_LOG_QUESTIONS'),
        question_embeddings_table=os.getenv('DBTABLE_PDS_QUESTION_EMBEDDINGS')
    )
    # MINI PROGRAM
    store_question_embeddings(
        logger,
        log_question_table=os.getenv('DBTABLE_MINIPROGRAM_LOG_QUESTIONS'),
        question_embeddings_table=os.getenv('DBTABLE_MINIPROGRAM_QUESTION_EMBEDDINGS')
    )
    # REMITTANCE
    store_question_embeddings(
        logger,
        log_question_table=os.getenv('DBTABLE_REMITTANCE_LOG_QUESTIONS'),
        question_embeddings_table=os.getenv('DBTABLE_REMITTANCE_QUESTION_EMBEDDINGS')
    )
    # REMITTANCE
    store_question_embeddings(
        logger,
        log_question_table=os.getenv('DBTABLE_REMITTANCE_LOG_QUESTIONS'),
        question_embeddings_table=os.getenv('DBTABLE_REMITTANCE_QUESTION_EMBEDDINGS')
    )
