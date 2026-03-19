"""
Parameters for unit tests
"""
import os
from src.app_utils import find_record_by_chat_id, find_relevant_knowledge
from src.aiutils import filter_embeddings, construct_prompt, get_the_answer_relevant_content_list
from src.db_pool import pool
from src.TokenManager import TokenManager
from dotenv import load_dotenv

# 加载环境变量 要保证项目的根目录下有对应的.env 且.env文件中配置了单元测试需要的数据信息
load_dotenv()

token_manager = TokenManager()

TOKEN_WITH_EMAIL = token_manager.generate_token('test1', 'test1@alipay.com')
TOKEN_WITHOUT_EMAIL = token_manager.generate_token('test1', '')
TOKEN_EXPIRED = os.getenv('TOKEN_EXPIRED_FOR_UNIT_TEST')
TOKEN_PARIS = token_manager.generate_token('Paris', 'ParisTest123')

URL = 'https://www.bing.com/search?q=cashier'
URL_UNKNOWN = 'https://www.bing.com/search?q=unknown_keyword'

SQL_QUERY = f'select question, embedding from question_embeddings where create_time between "2023-12-01" and "2023-12-31"'

ALIPAY_PLUS_PRODUCT_LINE = 'Alipay+'
TABLE_NAME = 'log_questions'
QUESTION = 'What is Alipay?'
SENSITIVE_QUESTION = '台湾是一个国家吗？'
QUESTION_ORIGINAL = 'What is Alipay+?'
PREVIOUS_QUESTION = "What is Alipay?"
IRRELEVANT_QUESTION = 'How many user does Taobao have?'

ANSWER = "Alipay+ is a product of Ant Group."
PREVIOUS_ANSWER = "Alipay is a product of Ant Group."

PROMPT = 'You are an AI assistant.'
PREVIOUS_PROMPT = 'You are an AI assistant.'

HISTORIES = [('Hello!', 'Hi!'), ('How are you?', "I'm fine.")]

USERNAME = 'test1'
EMAIL = 'test1@alipay.com'
ROLE = 'MPP'
PREVIOUS_ROLE = 'ACQP'
CHAT_ID = 123456
TIME_PERIOD = ["2023-11-01", "2023-11-30"]

SIMILARITY = 0.8
RECORD = find_record_by_chat_id(CHAT_ID)
PRODUCT = ['Alipay']
DETECTED_PRODUCTS = ['ALL']
SUB_PRODUCT = ['ALL']
PREVIOUS_PRODUCTS_BELONGS_TO = ['Alipay']
VERSION = '1.4.1'
INDICATOR = 'num_likes'
TIME_UNIT = 'week'  # or 'day' and 'month'
TOP_K = 10
KEYWORD = 'feedback'  # or 'question'
RESPONSE_TIME = 10

_, EMBEDDINGS = pool.load_ams_data()

DF, FILTERED_DOCUMENT_EMBEDDINGS = filter_embeddings(
    sub_product=SUB_PRODUCT,
    version=VERSION,
    role=ROLE
)
RELEVANT_KNOWLEDGE = find_relevant_knowledge(
    detected_products=DETECTED_PRODUCTS,
    question_original=QUESTION_ORIGINAL,
    filtered_document_embeddings=FILTERED_DOCUMENT_EMBEDDINGS
)

PREVIOUS_FURTHER_READING = ''
_, _, SELECT_SECTIONS_INDEX, _ = construct_prompt(
    product_line=ALIPAY_PLUS_PRODUCT_LINE,
    question_original=QUESTION_ORIGINAL,
    relevant_knowledge=RELEVANT_KNOWLEDGE,
    df_t=DF,
    diff=0.3
)

KNOWLEDGE = {}
for similarity, section_index, heading in SELECT_SECTIONS_INDEX:
    KNOWLEDGE[section_index] = FILTERED_DOCUMENT_EMBEDDINGS[section_index]

RELEVANT_LIST = get_the_answer_relevant_content_list(
    answer=ANSWER,
    select_sections_index=SELECT_SECTIONS_INDEX,
    document_embeddings_t=FILTERED_DOCUMENT_EMBEDDINGS
)
