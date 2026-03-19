import datetime
import hashlib
import json
import os
import shutil
import time
import uuid
from collections import Counter
from datetime import datetime
from logging import Logger
from pathlib import Path
from typing import Optional

import pandas as pd
import requests
from dotenv import load_dotenv
from flask import current_app as app, stream_with_context
from flask import g, Response, jsonify
from sqlalchemy import create_engine
from werkzeug.datastructures import FileStorage

from src import aiutils, app_utils, safeutils
from src.TokenManager import TokenManager
from src.db_pool import pool
from src.preprocessing_utils import replace_synonym
from src.services.user_sevice import UserService

load_dotenv()

# the minimal similarity between the input and the document
MINIMAL_DOCUMENT_SIMILARITY = 0.75
# the minimal similarity between the input and the document for specific question(any product detected in the question)
MINIMAL_DOCUMENT_SIMILARITY_FOR_SPECIFIC_QUESTION = 0.65
# the minimal similarity between the question and the previous question
THRESHOLD_SIMILARITY = 0.75
# the maximal similarity difference
MAXIMUM_DIFF_TO_USE = 0.1
# the maximum number of tokens in the input
MAX_INPUT_TOKENS = 200
# Whether to use the llm to summarize the chat history and generate a new question
USE_LLM_SUMMARY = False
# the minimal length of the chat history
MAX_HISTORY_LENGTH = 10
# infoSec check app scenario
INFOSEC_APPSCENE_ONLINE_QNA = "online_qna"
INFOSEC_APPSCENE_QNA_BOT = "qna_bot"
ALIPAY_PLUS_PRODUCT_LINE = os.getenv('ALIPAY_PLUS_PRODUCT_LINE')
AMS_PRODUCT_LINE = os.getenv('AMS_PRODUCT_LINE')
MINI_PROGRAM_PRODUCT_LINE = os.getenv('MINI_PROGRAM_PRODUCT_LINE')
INTERNAL_EMAIL_SUFFIX = eval(os.getenv('INTERNAL_EMAIL_SUFFIX'))
COMPLETIONS_MODEL = os.getenv('COMPLETIONS_MODEL')
ES_MODE = os.getenv('ES_MODE')
ROOT_PATH = Path(__file__).parents[1]


# region =========================================== Alipay+ Funcs (General) ===========================================
def deal_with_chat(
        product_line: str,  # the name of the current product line
        db_tables: dict,  # the tables the current product line uses
        chat_id: str,
        detected_products: list,
        question_original: str,
        username: str,
        df: pd.DataFrame,
        filtered_document_embeddings: dict = None,
        es_mode: str = ES_MODE,
        role: str = None,
        version: str = None,
        model: str = COMPLETIONS_MODEL,
        is_remittance: bool = False,
        **kwargs
) -> tuple[str, list, str, list, str, str, str]:
    records = []
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor(buffered=True)
        cur.execute(f'select question, answer from {db_tables.get("LOG_QUESTIONS")} where chat_id = %s', [chat_id])
        if cur.rowcount > 0:
            records = cur.fetchall()
    except Exception as e:
        app.logger.error("error when fetching chat histories: " + str(e))
    finally:
        con.close()

    # histories = [(record[0], json.loads(record[1])['answer']) for record in records]
    histories = [(record[0], record[1]) for record in records]
    app.logger.info(f'Chat history: {histories}')
    if len(histories) >= MAX_HISTORY_LENGTH:
        app.logger.info(
            f'The history of this chat (chat_id: {chat_id}) has exceeded the limit length and has been cleared.')
        chat_id = str(uuid.uuid4().int)[:32]
        histories = []

    query_for_doc_retrieval = aiutils.get_query_for_doc_retrieval(
        question_original,
        histories,
        # max_history_length=MAX_HISTORY_LENGTH,
        use_llm_summary=USE_LLM_SUMMARY
    )
    app.logger.debug(f'query_for_doc_retrieval: {query_for_doc_retrieval}')
    robot_type = kwargs.get('robot_type')
    if robot_type != 'Debugger':
        query_for_doc_retrieval = replace_synonym(query_for_doc_retrieval, pool.load_synonyms())
        app.logger.debug(f'new_query_for_doc_retrieval: {query_for_doc_retrieval}')
    # validate request text
    relevant_knowledge = app_utils.find_relevant_knowledge(
        detected_products=detected_products,
        question_original=query_for_doc_retrieval,
        filtered_document_embeddings=filtered_document_embeddings,
        es_mode=es_mode,
        query_for_doc_retrieval=query_for_doc_retrieval,
        db_table=db_tables.get('KNOWLEDGE_BASE'),
        role=role,
        version=version,
        **kwargs
    )

    g.question_text = question_original
    g.query_for_doc_retrieval = query_for_doc_retrieval
    g.data_source = kwargs.get('data_source')

    if len(relevant_knowledge) == 0:
        app.logger.debug("no relevant knowledge found for question: " + question_original)
        g.status = "REJECTED"
        g.status_message = "NO_RELEVANT_KNOWLEDGE"

        raise Exception("NO_RELEVANT_KNOWLEDGE")

    # construct prompt
    prompts, _, chosen_sections_indexes, chosen_documents = aiutils.construct_prompt(
        product_line, question_original,
        relevant_knowledge, df,
        MAXIMUM_DIFF_TO_USE, es_mode=es_mode, **kwargs)

    # handle the question
    prompt, answer = aiutils.handle_question(question_original, prompts, histories, model=model)

    # check if the answer fails infosec check
    is_passed_infosec, _ = safeutils.info_security_check(query=question_original,
                                                         answer=answer,
                                                         appScene=INFOSEC_APPSCENE_QNA_BOT,
                                                         username=username,
                                                         is_remittance=is_remittance)

    if not is_passed_infosec:
        app.logger.warning(f"Answer failed infosec check: {answer}")
        g.status = "REJECTED"
        g.status_message = "INFOSEC_CHECK_ANSWER_FAILED"
        raise Exception("INFOSEC_CHECK_ANSWER_FAILED")

    app.logger.debug("chosen_sections: " + str(chosen_sections_indexes))

    return answer, chosen_sections_indexes, chosen_documents, relevant_knowledge, prompt, chat_id, query_for_doc_retrieval


def store_question_embeddings(
        logger: Logger,
        log_question_table: str = 'log_questions',
        question_embeddings_table: str = 'question_embeddings'
) -> None:
    logger.info('Start running daily task `store_question_embeddings`.')
    host = os.getenv('MYSQL_HOST')
    user = os.getenv('MYSQL_USER')
    password = os.getenv('MYSQL_PASSWORD')
    database = "chatbot"
    try:
        engine = create_engine(f"mysql+pymysql://{user}:{password}@{host}/{database}")
        query = f'select id, question, role, version, create_time from {log_question_table} ' \
                f'where create_time between date_sub(curdate(), interval 1 day) and curdate() ' \
                f'and question != ""'
        df: pd.DataFrame = pd.read_sql(query, engine)
        new_df = df.rename({'id': 'question_id'}, axis=1)

        new_df['embedding'] = df.question.apply(lambda x: str(aiutils.compute_text_embedding(x)))
        new_df.to_sql(
            name=question_embeddings_table,
            con=engine,
            if_exists='append',
            index=False,
        )
    except Exception as e:
        logger.error(
            f'Running daily task `store_question_embeddings` failed (table: {question_embeddings_table}): {e}.')
    else:
        logger.info(f'Daily task `store_question_embeddings` completed (table: {question_embeddings_table}).')


# store the question and answer to the database
def store_question_and_answer(username, email, question, answer, possible_questions, further_reading, prompt, chat_id,
                              role, product, version,
                              response_time, model, db_table='log_questions', **kwargs) -> Optional[int]:
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    con = pool.get_connection()
    cur = con.cursor()
    # convert the product to string
    product = ",".join(product)
    data_source = kwargs.get('data_source')
    try:
        if data_source:
            cur.execute(f"INSERT INTO {db_table} "
                        "(user_name, question, answer, possible_questions, further_reading, prompt, chat_id, role, product_belongs_to, version, email, robot_response_time, model, data_source) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        (
                            username, question, answer, possible_questions, further_reading, prompt, chat_id, role,
                            product,
                            version, email, response_time, model, data_source))
        else:
            cur.execute(f"INSERT INTO {db_table} "
                        "(user_name, question, answer, possible_questions, further_reading, prompt, chat_id, role, product_belongs_to, version, email, robot_response_time, model) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        (
                            username, question, answer, possible_questions, further_reading, prompt, chat_id, role,
                            product,
                            version, email, response_time, model))

        con.commit()
        # get the id of the question and return
        cur.execute("SELECT LAST_INSERT_ID()")
        id = cur.fetchone()[0]
        app.logger.info('Successfully stored question and answer.')
        return id
    except Exception as e:
        app.logger.error(e)
        return None
    finally:
        con.close()


def log_question_for_analysis(db_table='question_processing_log'):
    try:
        # fetch information from global variable
        prompt = g.get('prompt')
        chat_id = g.get('chat_id')
        question_id = g.get('question_id')
        question_text = g.get('question_text')
        qcs = g.get('question_context_similarity')
        question_context_similarity = str(qcs) if qcs is not None else None

        answer_text = g.get('answer_text')
        acs = g.get('answer_context_similarity')
        answer_context_similarity = str(acs) if acs is not None else None

        status = g.get('status')
        status_message = g.get('status_message')
        query_for_doc_retrieval = g.get('query_for_doc_retrieval')
        data_source = g.get('data_source')
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        conn = pool.get_connection()
        if not status:
            return
        cur = conn.cursor()
        # insert analysis info into the database
        if data_source:
            cur.execute(f"""\
                INSERT INTO {db_table} (chat_id, question_id, question_text, question_context_similarity, answer_text, answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval, data_source)\
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                        (chat_id, question_id, question_text, question_context_similarity, answer_text,
                         answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval,
                         data_source))
        else:
            cur.execute(f"""\
                INSERT INTO {db_table} (chat_id, question_id, question_text, question_context_similarity, answer_text, answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval)\
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                        (chat_id, question_id, question_text, question_context_similarity, answer_text,
                         answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval))

        conn.commit()
    except Exception as e:
        app.logger.error(
            f"An error occurred when logging question for analysis: {e}")
    else:
        app.logger.info("Successfully logged question for analysis.")
    finally:
        conn.close()


def deal_with_stream_chat(
        product_line: str,
        db_tables: dict,
        detected_products: list,
        question_original: str,
        filtered_document_embeddings: dict,
        df: pd.DataFrame,
        chat_id: str,
        es_mode: str = ES_MODE,
        role: str = None,
        version: str = None,
        model: str = COMPLETIONS_MODEL,
        **kwargs
):
    records = []
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor(buffered=True)
        cur.execute(f'select question, answer from {db_tables.get("LOG_QUESTIONS")} where chat_id = %s', [chat_id])
        if cur.rowcount > 0:
            records = cur.fetchall()
    except Exception as e:
        app.logger.error("error when fetching chat histories: " + str(e))
    finally:
        con.close()

    # histories = [(record[0], json.loads(record[1])['answer']) for record in records]
    histories = [(record[0], record[1]) for record in records]
    if len(histories) >= MAX_HISTORY_LENGTH:
        app.logger.info(
            f'The history of this chat (chat_id: {chat_id}) has exceeded the limit length and has been cleared.')
        chat_id = str(uuid.uuid4().int)[:32]
        histories = []

    query_for_doc_retrieval = aiutils.get_query_for_doc_retrieval(question_original,
                                                                  histories,
                                                                  use_llm_summary=False)
    app.logger.debug(f'query_for_doc_retrieval: {query_for_doc_retrieval}')
    robot_type = kwargs.get('robot_type')
    if robot_type not in ['Debugger', 'Code Generator']:
        query_for_doc_retrieval = replace_synonym(query_for_doc_retrieval, pool.load_synonyms())
        app.logger.debug(f'new_query_for_doc_retrieval: {query_for_doc_retrieval}')

    # validate request text
    if robot_type in ['Debugger', 'Code Generator']:
        doc_titles = pool.get_api_sdk_doc_title_list(
            role=role, version=version, db_table=db_tables.get('KNOWLEDGE_BASE')
        )
        relevant_knowledge = aiutils.detect_title(
            query_for_doc_retrieval,
            doc_titles=doc_titles,
            db_table=db_tables.get('KNOWLEDGE_BASE'),
            role=role,
            version=version,
            **kwargs
        )
    else:
        relevant_knowledge = app_utils.find_relevant_knowledge(
            detected_products=detected_products,
            question_original=query_for_doc_retrieval,
            filtered_document_embeddings=filtered_document_embeddings,
            es_mode=es_mode,
            query_for_doc_retrieval=query_for_doc_retrieval,
            db_table=db_tables.get('KNOWLEDGE_BASE'),
            role=role,
            version=version,
            **kwargs
        )

    if len(relevant_knowledge) == 0:
        app.logger.info("no relevant knowledge found for question: " + query_for_doc_retrieval)
        g.status = "REJECTED"
        g.question_text = question_original
        g.query_for_doc_retrieval = query_for_doc_retrieval
        g.status_message = "NO_RELEVANT_KNOWLEDGE"
        g.data_source = kwargs.get('data_source')
        raise Exception("NO_RELEVANT_KNOWLEDGE")

    # construct prompt
    prompts, tools, chosen_sections_indexes, chosen_documents = aiutils.construct_prompt(
        product_line,
        question_original,
        relevant_knowledge,
        df,
        MAXIMUM_DIFF_TO_USE,
        es_mode=es_mode,
        **kwargs
    )
    prompt = prompts[0]['content']
    app.logger.debug(f"Prompt: {prompt}")
    app.logger.debug(f"User question: {question_original}")

    # treat as a new question
    response = aiutils.handle_stream_answer(question_original, prompts, tools, histories, model=model, **kwargs)

    return response, chosen_sections_indexes, chosen_documents, relevant_knowledge, prompt, chat_id, query_for_doc_retrieval


def stream_log_question_for_analysis(chat_id, question_id, question_text, question_context_similarity,
                                     answer_text, answer_context_similarity, status, status_message, prompt,
                                     query_for_doc_retrieval, db_table='question_processing_log', **kwargs):
    """
    Log question for analysis in stream mode
    """
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        conn = pool.get_connection()
        cur = conn.cursor()
        data_source = kwargs.get('data_source')
        # insert analysis info into the database
        if data_source:
            cur.execute(f"""\
                INSERT INTO {db_table} (chat_id, question_id, question_text, question_context_similarity, answer_text, answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval, data_source)\
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                        (chat_id, question_id, question_text, question_context_similarity, answer_text,
                         answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval,
                         kwargs.get('data_source')))
        else:
            cur.execute(f"""\
                INSERT INTO {db_table} (chat_id, question_id, question_text, question_context_similarity, answer_text, answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval)\
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                        (chat_id, question_id, question_text, question_context_similarity, answer_text,
                         answer_context_similarity, status, status_message, prompt, query_for_doc_retrieval))

        conn.commit()
    except Exception as e:
        app.logger.error(
            f"An error occurred when logging question for analysis (stream): {e}")
    else:
        app.logger.info("Successfully logged question for analysis (stream).")
    finally:
        conn.close()


# endregion

# region ================================================== AMS Funcs ==================================================
def ams_deal_with_stream_chat(detected_products, question_original, filtered_document_embeddings, username, df,
                              chat_id):
    records = []
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor(buffered=True)
        cur.execute('select question, answer from ams_log_questions_v2 where chat_id = %s', [chat_id])
        if cur.rowcount > 0:
            records = cur.fetchall()
    except Exception as e:
        app.logger.error("error when fetching chat histories: " + str(e))
    finally:
        con.close()

    histories = [(record[0], record[1]) for record in records]
    if len(histories) >= MAX_HISTORY_LENGTH:
        app.logger.info(
            f'The history of this chat (chat_id: {chat_id}) has exceeded the limit length and has been cleared.')
        chat_id = str(uuid.uuid4().int)[:32]
        histories = []

    query_for_doc_retrieval = aiutils.get_query_for_doc_retrieval(question_original,
                                                                  histories,
                                                                  use_llm_summary=False)

    # validate request text
    relevant_knowledge = app_utils.find_relevant_knowledge(
        detected_products=detected_products,
        question_original=query_for_doc_retrieval,
        filtered_document_embeddings=filtered_document_embeddings,
        es_mode='none'
    )
    if len(relevant_knowledge) == 0:
        app.logger.info(
            "no relevant knowledge found for question: " + query_for_doc_retrieval)
        g.status = "REJECTED"
        g.status_message = "NO_RELEVANT_KNOWLEDGE"
        raise Exception("NO_RELEVANT_KNOWLEDGE")

    # construct prompt
    prompts, _, chosen_sections_indexes, _ = aiutils.construct_prompt("Alipay+", question_original,
                                                                      relevant_knowledge, df, MAXIMUM_DIFF_TO_USE)
    prompt = prompts[0]['content']
    # treat as a new question
    answer = aiutils.ams_handle_stream_answer(question_original, prompt, histories)

    return answer, chosen_sections_indexes, prompt, chat_id


def ams_store_question_and_answer(username, email, question, answer, further_reading,
                                  prompt, chat_id, product, submit_type) -> int:
    question_id = generate_question_id()
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    con = pool.get_connection()
    cur = con.cursor()
    # convert the product to string
    product = ",".join(product)
    try:
        cur.execute("INSERT INTO ams_log_questions_v2 "
                    "(user_name, question_id, question, answer, further_reading, prompt, chat_id, product_belongs_to, email, extend_info) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (username, question_id, question, answer, further_reading, prompt, chat_id, product, email,
                     submit_type))
        con.commit()
        # get the id of the question and return
        cur.execute("SELECT LAST_INSERT_ID()")
        id = cur.fetchone()[0]
        return id
    except Exception as e:
        app.logger.error(e)
        return None
    finally:
        con.close()


def generate_question_id():
    # 获取当前日期，并格式化为'yyyyMMdd'格式
    date_str = datetime.now().strftime('%Y%m%d')

    # 获取纳秒级时间戳。注意：Python本身不提供直接获取纳秒时间戳的方法。此处使用time.time()获取秒级时间戳，乘以10的9次方转为纳秒，并取整。
    # 对于确保唯一性和精度，这里的实现可能需要根据实际情况调整。
    time_ns = int(time.time() * 1e9)

    # 将时间戳转换为字符串，并截取最后16位。如果不足16位，使用zfill方法进行右对齐补0至16位。
    time_str = str(time_ns)[-16:].zfill(16)

    # 合并日期字符串和处理过的时间字符串
    id_str = date_str + time_str

    return id_str


def log_question_for_ams_analysis():
    try:
        # fetch information from global variable
        prompt = g.get('prompt')
        chat_id = g.get('chat_id')
        question_id = g.get('question_id')
        question_text = g.get('question_text')
        question_context_similarity = g.get('question_context_similarity')
        question_context_similarity = str(question_context_similarity)

        answer_text = g.get('answer_text')
        answer_context_similarity = g.get('answer_context_similarity')
        answer_context_similarity = str(answer_context_similarity)

        status = g.get('status')
        status_message = g.get('status_message')
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        conn = pool.get_connection()
        cur = conn.cursor()
        # insert analysis info into the database
        cur.execute("""\
            INSERT INTO ams_question_processing_log (chat_id, question_id, question_text, question_context_similarity, answer_text, answer_context_similarity, status, status_message, prompt)\
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    (chat_id, question_id, question_text, question_context_similarity, answer_text,
                     answer_context_similarity, status, status_message, prompt))
        conn.commit()
    except Exception as e:
        app.logger.error(
            f"An error occurred when logging question for analysis (AMS): {e}")
    finally:
        conn.close()
        app.logger.info("Logged question for analysis.")


# endregion

# region ============================================= Chatbot API Funcs ==============================================
def login(request_body):
    """
    Login
    """
    if request_body and "access_token" in request_body:
        access_token = request_body["access_token"]
        if access_token == "":
            return {"message": "Empty access_token."}, 400
        # lable = DING means the user is from Dingtalk, label = DOC means the user is from developer doc center
        access_token_source = request_body["access_token_source"]
        # get the userid from the access_token
        # developer center authentication
        data = {}
        referer = 'https://idocs.alipay.com'
        if access_token_source == "DOC":
            # post to the token url to verify token and get the user info
            url = os.getenv("DOC_TOKEN_URL")
        elif access_token_source == "AMS_DOC":
            url = os.getenv("AMS_DOC_TOKEN_URL")
        elif access_token_source == "PDS_DOC":
            url = os.getenv("PDS_DOC_TOKEN_URL")
        elif access_token_source == "MINI_DOC":
            url = os.getenv("MINI_DOC_TOKEN_URL")
        elif access_token_source == "REMITTANCE_DOC":
            url = os.getenv("REMITTANCE_DOC_TOKEN_URL")
        elif access_token_source == 'APS_DEVELOPER':
            url = os.getenv("APS_DEVELOPER_DOC_TOKEN_URL")
            data = {"token": access_token}
            referer = os.getenv("APS_DEVELOPER_DOC_TOKEN_URL")
        else:
            return {"message": "Invalid access_token_source."}, 400

        headers = {'Content-Type': 'application/json', 'referer': referer,
                   'authorization': f'IDOCS_CHATBOT_TOKEN {access_token}'}
        # method post
        r = requests.post(url, json=data, headers=headers)
        # if the status == 200, get the data, combine data.memberId + data.portal as user_id
        if r.status_code != 200:
            app.logger.error(
                "error when fetching user info from developer center:")
            app.logger.error(r.json())
            return {"message": "Invalid access_token."}, 500
        else:
            app.logger.info("user info fetched from developer center:")
            app.logger.info(r.json())
            if r.json()["success"] == False:
                return {"message": "Access token info fetching error."}, 401
            else:
                # fetch the user email from the database
                portal = r.json()["data"]["portal"]
                memberId = r.json()["data"]["memberId"]
                app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
                try:
                    con = pool.get_connection()
                    cur = con.cursor()
                    cur.execute('select email from user where user_name = %s', [
                        portal + "_" + memberId])
                    record = cur.fetchone()
                except Exception as e:
                    app.logger.error(e)
                finally:
                    con.close()
                if not record:
                    user_info = {"user_id": portal + "_" + memberId, "user_email": ""}
                else:
                    user_info = {"user_id": portal + "_" + memberId, "user_email": record[0]}
                    # get the user email from response

                # try to get the user email from response:
                try:
                    user_email = r.json()["data"]["email"]
                    user_info["user_email"] = user_email
                except KeyError:
                    app.logger.debug(
                        "user_email not found in idocs token verification response.")
                    pass

                app.logger.info(
                    "logging from developer center with user info:")
                app.logger.info(user_info)

        userid = user_info["user_id"]
        user_email = user_info["user_email"] or ""
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute('select email from user where user_name = %s', [userid])
            record = cur.fetchone()
        except Exception as e:
            app.logger.error(e)
        finally:
            con.close()
        if not record:
            # add the user to the database with a label for user to indicate whether the user is from Dingtalk and developer center
            app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
            try:
                con = pool.get_connection()
                cur = con.cursor()
                cur.execute('insert into user(user_name, email) values(%s,%s);', [
                    userid, user_email])
                con.commit()
            except Exception as e:
                app.logger.error(e)
            finally:
                con.close()
            # generate the token for the user
            token = TokenManager.generate_token(userid, user_email)
            return {'token': token, 'user_email': user_email}, 200
        else:
            # if the user already exists, generate the token for the user
            # if the email changes, update the email in the database
            if record[0] != "" and record[0] != user_email:
                app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
                try:
                    con = pool.get_connection()
                    cur = con.cursor()
                    cur.execute('update user set email=%s where user_name=%s', [
                        user_email, userid])
                    con.commit()
                except Exception as e:
                    app.logger.error(e)
                finally:
                    con.close()
            token = TokenManager.generate_token(userid, user_email)
            return {'token': token, 'user_email': user_email}, 200

    # for the user who registered with email and password
    if not request_body or "username" not in request_body or "password" not in request_body:
        return {"message": "Missing username or password."}, 400

    username = request_body["username"]
    password = request_body["password"]

    validated, email = UserService.verify_user_password(username, password)
    if not validated:
        print("User or password incorrect.")
        return {"message": "User or password incorrect."}, 401
    
    token = TokenManager.generate_token(username, email)
    return {'token': token, 'user_email': email}, 200


def update_email(request, username, email):
    """
    Update email
    """
    if email != "":
        return {"message": "Email already exists."}, 400
    requestBody = request.get_json()
    if not requestBody or "email" not in requestBody:
        return {"message": "Registered Email not found."}, 400
    register_email = requestBody["email"]
    app.logger.info(username + " is updating email to " + register_email)
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor()
        cur.execute('update user set email = %s where user_name = %s',
                    [register_email, username])
        con.commit()
    except Exception as e:
        app.logger.error(e)
    finally:
        con.close()
    new_token = TokenManager.generate_token(username, register_email)
    return {"message": "Email created successfully.", "user_email": register_email, "new_token": new_token}, 201


def question_index_v2(
        username, email, start_time, role, product, version, chat_id, detected_products,
        question_original, db_tables: dict, es_mode: str = ES_MODE, model=COMPLETIONS_MODEL,
        product_line=ALIPAY_PLUS_PRODUCT_LINE, is_remittance=False, **kwargs
):
    """
    Chat with DocGPT
    """
    # filter the document embeddings by product, version and role
    if es_mode == 'none':
        df, filtered_document_embeddings = aiutils.filter_embeddings(product, version, role,
                                                                     db_table=db_tables.get('KNOWLEDGE_BASE'))
        time_taken = time.time() - start_time
        app.logger.debug(f"Time taken to run filter_embeddings: {time_taken}")
    else:
        df, filtered_document_embeddings = None, None

    answer, chosen_sections_indexes, chosen_documents, relevant_knowledge, prompt, chat_id, query_for_doc_retrieval = deal_with_chat(
        product_line=product_line,
        db_tables=db_tables,
        chat_id=chat_id,
        detected_products=detected_products,
        question_original=question_original,
        filtered_document_embeddings=filtered_document_embeddings,
        es_mode=es_mode,
        role=role,
        version=version,
        username=username,
        df=df,
        model=model,
        is_remittance=is_remittance,
        **kwargs
    )

    llm_found_relevant_knowledge = app_utils.llm_get_knowledge_check(answer)
    app.logger.info(f'LLM found relevant knowledge: {llm_found_relevant_knowledge}')

    # 如果模型根据用户问题找不到所需的知识，则生成三个建议的问题，并且不提供相关知识链接
    if not llm_found_relevant_knowledge:
        possible_questions = aiutils.get_possible_questions(question_original, chosen_documents, model=model)
        relevant_content_list = []
        relevant_knowledge_links = []
    else:
        possible_questions = []
        # When using Elasticsearch
        if es_mode != 'none':
            df = pd.DataFrame({
                kid: {"similarity": similarity,
                      "title": title,
                      "url": url,
                      "content": content,
                      "features": features}
                for similarity, kid, title, url, content, features in relevant_knowledge
            }).T
            filtered_document_embeddings = {kid: eval(features) for _, kid, _, _, _, features in relevant_knowledge} # [SINK]
            relevant_content_list = aiutils.get_the_answer_relevant_content_list(
                answer,
                chosen_sections_indexes,
                document_embeddings_t=filtered_document_embeddings
            )
            relevant_knowledge_links = aiutils.get_answer_relevant_knowledge(
                relevant_content_list, df)
        else:
            # get relevant knowledge list
            relevant_content_list = aiutils.get_the_answer_relevant_content_list(
                answer, chosen_sections_indexes, filtered_document_embeddings)
            relevant_knowledge_links = aiutils.get_answer_relevant_knowledge(
                relevant_content_list, df)

    # store the question and answer to the database
    response_time = time.time() - start_time
    # answer_data_string = json.dumps(
    #     {
    #         "answer": answer,
    #         "possible_questions": possible_questions,
    #         "further_reading": relevant_knowledge_links
    #     },
    #     ensure_ascii=False
    # )
    question_id = store_question_and_answer(
        username=username,
        email=email,
        question=question_original,
        answer=answer,
        possible_questions=json.dumps(possible_questions, ensure_ascii=False),
        further_reading=json.dumps(relevant_knowledge_links, ensure_ascii=False),
        prompt=prompt,
        chat_id=chat_id,
        role=role,
        product=product,
        version=version,
        response_time=response_time,
        model=model,
        db_table=db_tables.get('LOG_QUESTIONS'),
        data_source=kwargs.get('data_source')
    )
    # if question_id is None, failed to insert
    if question_id is None:
        app.logger.error("question insertion error")
        g.status = "REJECTED"
        g.status_message = "QUESTION_INSERTION_ERROR"
        raise Exception("QUESTION_INSERTION_ERROR")
    # app.logger.info("chosen_sections: " + str(chosen_sections_indexes))
    # app.logger.info("answer: " + answer)

    g.question_text = question_original
    g.answer_text = answer
    g.chat_id = chat_id
    g.status = "PASSED" if llm_found_relevant_knowledge else "REJECTED"
    g.status_message = "OK" if llm_found_relevant_knowledge else "GPT_FOUND_NO_KNOWLEDGE"
    g.question_id = question_id
    g.question_context_similarity = chosen_sections_indexes
    g.possible_questions = possible_questions
    g.answer_context_similarity = relevant_content_list
    g.prompt = prompt
    g.query_for_doc_retrieval = query_for_doc_retrieval
    return {"answer": answer,
            "chat_id": chat_id,
            "possible_questions": possible_questions,
            "further_reading": relevant_knowledge_links,
            "question_id": question_id}


def question_stream_index_v2(username, email, start_time, role, product, version, chat_id, detected_products,
                             question_original, db_tables: dict, es_mode=ES_MODE, model=COMPLETIONS_MODEL,
                             product_line=ALIPAY_PLUS_PRODUCT_LINE, is_remittance=False, **kwargs):
    """
    Chat with DocGPT in stream mode
    """
    # filter the document embeddings by product, version and role
    if es_mode == 'none':
        df, filtered_document_embeddings = aiutils.filter_embeddings(product, version, role,
                                                                     db_table=db_tables.get('KNOWLEDGE_BASE'))
        time_taken = time.time() - start_time
        app.logger.debug(f"Time taken to run filter_embeddings: {time_taken}")
    else:
        df, filtered_document_embeddings = None, None

    chat_req, chosen_sections_indexes, chosen_documents, relevant_knowledge, prompt, chat_id, query_for_doc_retrieval = deal_with_stream_chat(
        product_line,
        db_tables,
        detected_products,
        question_original,
        filtered_document_embeddings,
        df,
        chat_id,
        es_mode=es_mode,
        role=role,
        version=version,
        model=model,
        **kwargs
    )

    headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
    }
    # Local import to avoid circular import
    from src.streamutils import generator
    return Response(stream_with_context(generator(
        chat_req=chat_req,
        question_original=question_original,
        query_for_doc_retrieval=query_for_doc_retrieval,
        username=username,
        chosen_sections_indexes=chosen_sections_indexes,
        chosen_documents=chosen_documents,
        # chosen_titles_and_urls=chosen_titles_and_urls,
        filtered_document_embeddings=filtered_document_embeddings,
        df=df,
        relevant_knowledge=relevant_knowledge,
        es_mode=es_mode,
        email=email,
        chat_id=chat_id,
        prompt=prompt,
        role=role,
        product=product,
        version=version,
        app_sense=INFOSEC_APPSCENE_QNA_BOT,
        start_time=start_time,
        db_tables=db_tables,
        model=model,
        is_remittance=is_remittance,
        data_source=kwargs.get('data_source'))),
        mimetype="text/event-stream", headers=headers)


def frontend_review(video: FileStorage, **kwargs):
    assert video, '`video` must be provided!'
    role = kwargs['role']
    product = kwargs['product']
    username = kwargs['username']
    email = kwargs['email']
    ssim_threshold = float(kwargs.get('ssim_threshold', 0.95))
    instruction = kwargs['instruction']
    language = kwargs.get('language', 'en')
    random_id = str(uuid.uuid4())
    temp_video_dir = os.path.join(ROOT_PATH, 'temp/videos')
    temp_frame_dir = os.path.join(ROOT_PATH, f'temp/frames/{random_id}')
    os.makedirs(temp_video_dir, exist_ok=True)
    os.makedirs(temp_frame_dir, exist_ok=True)

    temp_video_path = os.path.join(temp_video_dir, f'{random_id}_temp_video.mp4')
    video.save(temp_video_path)

    try:
        app_utils.deduplicate_frames(
            video_path=temp_video_path,
            output_dir=temp_frame_dir,
            ssim_threshold=ssim_threshold
        )
        engine = pool.db_engine
        query = 'select content, image_urls from image_knowledge_base where product = %s and role = %s'
        records = pd.read_sql(
            sql=query,
            params=(product, role),
            con=engine
        ).to_dict('records')
        standards = [(record['content'], record['image_urls']) for record in records]

        image_paths = os.listdir(temp_frame_dir)
        video_frames = []
        for image_path in image_paths:
            full_path = os.path.join(temp_frame_dir, image_path)
            video_frames.append(app_utils.encode_image(full_path))

        output, prompt = aiutils.video_understanding(standards, video_frames, instruction=instruction,
                                                     language=language)
        store_question_and_answer(
            username=username,
            email=email,
            question='',
            answer=output,
            possible_questions='[]',
            further_reading='[]',
            prompt=prompt,
            chat_id='',
            role=role,
            product=[product],
            version='',
            response_time=.0,
            model=COMPLETIONS_MODEL,
            data_source='FRONTEND_REVIEW'
        )
        return output
    except Exception as e:
        app.logger.error(f'Frontend review error: {e}')
        raise e
    finally:
        os.remove(temp_video_path)
        shutil.rmtree(temp_frame_dir)
        app.logger.info(f'Temp video `{temp_video_path}` and frames `{temp_frame_dir}` have been removed!')


def get_feedback(username, email, user_email, question_id, liked, feedback, require_email_update, feedback_email,
                 is_ams=False, is_pds=False, is_mini=False, is_remittance=False, **kwargs):
    if liked == "dislike":
        if user_email == "":
            # fetch email from user by username if email is empty from token
            app.logger.info(
                "email not found in token, fetch email from user by username")
            app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
            try:
                con = pool.get_connection()
                cur = con.cursor()
                cur.execute(
                    'SELECT email FROM user WHERE user_name = %s', [username])
                result = cur.fetchone()
                user_email = result[0] if result else ""
                if user_email == "":
                    return {"message": "Email not found."}, 400
            except Exception as e:
                app.logger.error(
                    f"An error occurred looking for email when feedback: {e}")
                return None
            finally:
                con.close()
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    # fetch question, answer, product_belongs_to, version, role from log_question by qid
    try:
        con = pool.get_connection()
        cur = con.cursor()
        if is_pds:
            log_questions_table = os.getenv('DBTABLE_PDS_LOG_QUESTIONS')
            feedback_url = '/pds/api/manage/feedback'
        elif is_mini:
            log_questions_table = os.getenv('DBTABLE_MINIPROGRAM_LOG_QUESTIONS')
            feedback_url = '/mini/api/manage/feedback'
        elif is_remittance:
            log_questions_table = os.getenv('DBTABLE_REMITTANCE_LOG_QUESTIONS')
            feedback_url = '/remittance/api/manage/feedback'
        elif is_ams:
            log_questions_table = 'ams_log_questions_v2'
            feedback_url = '/ams/api/manage/feedback'
        else:  # Alipay+
            log_questions_table = 'log_questions'
            feedback_url = '/api/manage/feedback'

        if is_ams:
            cur.execute(
                f'SELECT chat_id, question, answer,create_time, product_belongs_to, email FROM {log_questions_table} WHERE id = %s',
                [question_id])

            result = cur.fetchone()
            # if the question is not found, return 400
            if result is None:
                return {"message": "Question not found, please submit with valid question_id."}, 400
            chat_id, question, answer, create_time, product_belongs_to, email = result
            version = ""
            role = "ACQP"

        else:
            cur.execute(
                f'SELECT chat_id, question, answer, product_belongs_to, version, role FROM {log_questions_table} WHERE id = %s',
                [question_id])

            result = cur.fetchone()
            # if the question is not found, return 400
            if result is None:
                return {"message": "Question not found, please submit with valid question_id."}, 400
            chat_id, question, answer, product_belongs_to, version, role = result
    except Exception as e:
        app.logger.error(
            f"An error occurred when fetch question details for feedback: {e}")
        return None
    finally:
        con.close()

    # # String product_belongs_to
    # answer = json.loads(answer)["answer"]

    # Create a new feedback object
    new_feedback = {
        "chat_id": chat_id,
        "question_id": question_id,
        "question": question,
        "answer": answer,
        "username": username,
        "user_email": email,
        "feedback": feedback,
        "product": product_belongs_to,
        "version": version,
        "role": role,
        "liked": liked,
        "require_email_update": require_email_update,
        "feedback_email": feedback_email,
        "sync_ticket": "N",
        "data_source": kwargs.get('data_source')
    }

    # logo the feedback
    app.logger.info("submitting feedback : " + str(new_feedback))

    # POST to the feedback service /api/manage/feedback
    # change the url to the feedback service url, and request & save a token to use for authentication
    token = TokenManager.get_feedback_token()
    app.logger.info("feedback token: " + token)

    if is_ams:
        r = requests.post(os.getenv('BACKOFFICE_URL') + feedback_url,
                          json=new_feedback, headers={'AccessToken': token})
        # log response code and response body
        app.logger.info("feedback response code: " + str(r.status_code))
        app.logger.info("feedback response: " + str(r.json()))
        feedback_id = 0
        if r.status_code == 201:
            feedback_id = r.json().get('feedback_id')
        # AMS 前端不感知失败结果
        return jsonify({'message': 'Feedback submitted successfully', 'feedback_id': feedback_id}), 201
    # else:
    r = requests.post(os.getenv('BACKOFFICE_URL') + feedback_url,
                      json=new_feedback, headers={'AccessToken': token})
    # log response code and response body
    app.logger.info("feedback response code: " + str(r.status_code))
    try:
        app.logger.info("feedback response: " + str(r.json()))
    except Exception as e:
        print(e)
        app.logger.info("feedback response: " + str(r))
    if r.status_code == 201:
        feedback_id = r.json().get('feedback_id')
        return jsonify({'message': 'Feedback submitted successfully', 'feedback_id': feedback_id}), 201
    else:
        return jsonify({'message': 'Feedback submission failed'}), 500


# endregion

# region ============================================ Dashboard API Funcs =============================================
def get_userdata(time_period, role, version, product_line):
    """
    Get userdata for Dashboard
    """
    if role == 'All' and version != 'All':
        role_version_query = f'and version = "{version}"'
    elif role != 'All' and version == 'All':
        role_version_query = f'and role = "{role}"'
    elif role == 'All' and version == 'All':
        role_version_query = ''
    else:
        role_version_query = f'and role = "{role}" and version = "{version}"'

    match product_line:
        case 'Alipay+':
            log_questions_table = 'log_questions'
            feedback_table = 'feedback'
        case 'PDS':
            log_questions_table = 'pds_log_questions'
            feedback_table = 'pds_feedback'
        case 'Remittance':
            log_questions_table = 'remittance_log_questions'
            feedback_table = 'remittance_feedback'
        case 'MINI':  # MINI
            log_questions_table = 'mini_log_questions'
            feedback_table = 'mini_feedback'
        case _:
            return None
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor()

        # 点赞点踩数
        cur.execute(
            f'select liked, count(liked) from {feedback_table} where create_datetime between %s and %s {role_version_query} group by liked',
            [time_period[0], time_period[1]]
        )
        liked_records = dict(cur.fetchall())
        num_likes, num_dislikes = liked_records.get('like', 0), liked_records.get('dislike', 0)

        # 用户问题总数/机器人对话总数/用户总数（注册邮箱总数）
        cur.execute(
            f'select count(*), count(distinct chat_id), count(distinct email) from {log_questions_table} '
            f'where create_time between %s and %s {role_version_query}',
            [time_period[0], time_period[1]]
        )
        num_questions, num_chats, num_users = cur.fetchone()

        # 外部机构问题数/外部机构用户数
        # ['antgroup.com', 'alibaba-inc.com']
        email_query_list = [f'and email not like "%{x}"' for x in INTERNAL_EMAIL_SUFFIX]
        email_query = ' '.join(email_query_list)
        cur.execute(
            f'select count(*), count(distinct email) from {log_questions_table} '
            f'where create_time between %s and %s {role_version_query} {email_query}',
            [time_period[0], time_period[1]]
        )
        num_external_questions, num_external_users = cur.fetchone()

        # 带有响应时间的对话总数
        cur.execute(
            f'select count(distinct chat_id) from {log_questions_table} '
            f'where create_time between %s and %s {role_version_query} '
            f'and robot_response_time is not null',
            [time_period[0], time_period[1]]
        )
        num_chats_with_response_time = cur.fetchone()[0]

        # 对话时长总和
        cur.execute(
            f'select sum(robot_response_time) from {log_questions_table} '
            f'where  create_time between %s and %s {role_version_query}',
            [time_period[0], time_period[1]]
        )
        time_chats = cur.fetchone()[0]

        # Enable 过 email updates 的问题数
        cur.execute(
            f'select count(require_email_update) from {feedback_table} where require_email_update = "Y" '
            f'and create_datetime between %s and %s {role_version_query}',
            [time_period[0], time_period[1]]
        )
        num_email_updates = cur.fetchone()[0]

    except Exception as e:
        app.logger.error(
            f"An error occurred when querying user data for dashboard: {e}")
        return None
    finally:
        con.close()

    data = {
        "num_likes": num_likes,  # 点赞数
        "num_dislikes": num_dislikes,  # 点踩数
        "rate_likes": num_likes / num_questions if num_questions != 0 else 0,  # 点赞率
        "rate_dislikes": num_dislikes / num_questions if num_questions != 0 else 0,  # 点踩率
        "num_chats": num_chats,  # 对话数
        "num_questions": num_questions,  # 用户问题数
        "num_users": num_users,  # 用户数
        "num_external_questions": num_external_questions,  # 外部机构问题数
        "num_external_users": num_external_users,  # 外部机构用户数
        "avg_num_questions": num_questions / num_chats if num_chats != 0 else 0,  # 平均对话问题数
        # "avg_time_chats": time_chats / num_chats if num_chats != 0 else 0,  # 平均对话时长
        "avg_time_chats": time_chats / num_chats_with_response_time if num_chats_with_response_time != 0 else 0,
        # 平均对话时长
        "num_email_updates": num_email_updates,  # 开通邮件通知的问题数
        "avg_num_email_updates": num_email_updates / num_dislikes if num_dislikes != 0 else 0  # 开通邮件通知的问题比率
    }

    return data


def get_robot_performance(time_period, role, version, product_line):
    """
    Get robot performance for Dashboard
    """

    def role_version_query(alias=''):
        """
        Return the query string according to the role and the version
        """
        if alias:
            alias += '.'

        if role == 'All' and version != 'All':
            role_query = ''
            version_query = f'and {alias}version = "{version}"'
        elif role != 'All' and version == 'All':
            role_query = f'and {alias}role = "{role}"'
            version_query = ''
        elif role == 'All' and version == 'All':
            role_query = ''
            version_query = ''
        else:
            role_query = f'and {alias}role = "{role}"'
            version_query = f'and {alias}version = "{version}"'
        return f'{role_query} {version_query}'

    match product_line:
        case 'Alipay+':
            log_questions_table = 'log_questions'
            feedback_table = 'feedback'
            question_processing_log_table = 'question_processing_log'
        case 'PDS':
            log_questions_table = 'pds_log_questions'
            feedback_table = 'pds_feedback'
            question_processing_log_table = 'pds_question_processing_log'
        case 'Remittance':
            log_questions_table = 'remittance_log_questions'
            feedback_table = 'remittance_feedback'
            question_processing_log_table = 'remittance_question_processing_log'
        case 'MINI':  # MINI
            log_questions_table = 'mini_log_questions'
            feedback_table = 'mini_feedback'
            question_processing_log_table = 'mini_question_processing_log'
        case _:
            return None
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor()

        # 机器人回答问题总数
        cur.execute(
            f'select count(lq.answer) from {log_questions_table} lq inner join {question_processing_log_table} qpl '
            f'on lq.id = qpl.question_id where lq.create_time between %s and %s {role_version_query("lq")} '
            f'and qpl.status = "PASSED"',
            # f'and qpl.status_message != "GPT_FOUND_NO_KNOWLEDGE"',
            [time_period[0], time_period[1]]
        )
        num_answers = cur.fetchone()[0]

        cur.execute(
            f'select count(lq.answer) from {log_questions_table} lq inner join {question_processing_log_table} qpl '
            f'on lq.id = qpl.question_id where lq.create_time between %s and %s {role_version_query("lq")} '
            f'and qpl.status = "PASSED" and lq.robot_response_time is not null',
            [time_period[0], time_period[1]]
        )
        num_answers_with_response_time = cur.fetchone()[0]

        # 用户问题总数
        cur.execute(
            f'select count(*) from {log_questions_table} where create_time between %s and %s {role_version_query()}',
            [time_period[0], time_period[1]]
        )
        num_questions = cur.fetchone()[0]

        # 准确率
        cur.execute(
            f'select count(lq.answer) from {log_questions_table} lq inner join {feedback_table} f '
            f'on lq.id = f.question_id where lq.create_time between %s and %s {role_version_query("lq")} '
            f'and f.liked = "dislike"',
            [time_period[0], time_period[1]]
        )
        num_dislike_answers = cur.fetchone()[0]
        num_not_dislike_answers = num_answers - num_dislike_answers
        accuracy = num_not_dislike_answers / num_answers if num_answers != 0 else 0

        # 信息一次直达率
        cur.execute(
            f'select count(*) from (select chat_id from {log_questions_table} where create_time between %s and %s {role_version_query()} '
            f'group by chat_id having count(*) = 1) as chat_ids',
            [time_period[0], time_period[1]]
        )
        num_one_question_chats = cur.fetchone()[0]
        rate_solved_in_one_question = num_not_dislike_answers / num_one_question_chats if num_one_question_chats != 0 else 0

        # 平均问题响应时长
        cur.execute(
            f'select sum(robot_response_time) from {log_questions_table} '
            f'where  create_time between %s and %s {role_version_query()}',
            [time_period[0], time_period[1]]
        )
        time_response = cur.fetchone()[0]
        # avg_time_response = time_response / num_answers if num_answers != 0 else 0
        avg_time_response = time_response / num_answers_with_response_time if num_answers_with_response_time != 0 else 0

        # 安全拦截率
        cur.execute(
            'select count(*) as all_records, '
            'sum(case when status_message = "INFOSEC_CHECK_QUESTION_FAILED" then 1 else 0 end) as filtered_records '
            f'from {question_processing_log_table} where create_time between %s and %s',
            [time_period[0], time_period[1]])
        num_all_questions, num_infosec_failed = cur.fetchone()
        rate_infosec_failed = int(num_infosec_failed) / num_all_questions if num_all_questions != 0 else 0

    except Exception as e:
        app.logger.error(
            f"An error occurred when querying robot performance for dashboard: {e}")
        return None
    finally:
        con.close()

    data = {
        "num_answers": num_answers,
        "rate_answers": num_answers / num_questions if num_questions != 0 else 0,
        "accuracy": accuracy,
        "rate_solved_in_one_question": rate_solved_in_one_question,
        "avg_time_response": avg_time_response,
        "rate_infosec_failed": rate_infosec_failed
    }

    return data


def get_trend_analysis(indicator, time_unit, time_period, role, version, product_line):
    """
    Get trend analysis for Dashboard
    """

    def role_version_query(alias=''):
        """
        Return the query string according to the role and the version
        """
        if alias:
            alias += '.'

        if role == 'All' and version != 'All':
            role_query = ''
            version_query = f'and {alias}version = "{version}"'
        elif role != 'All' and version == 'All':
            role_query = f'and {alias}role = "{role}"'
            version_query = ''
        elif role == 'All' and version == 'All':
            role_query = ''
            version_query = ''
        else:
            role_query = f'and {alias}role = "{role}"'
            version_query = f'and {alias}version = "{version}"'
        return f'{role_query} {version_query}'

    match product_line:
        case 'Alipay+':
            log_questions_table = 'log_questions'
            feedback_table = 'feedback'
            question_processing_log_table = 'question_processing_log'
        case 'PDS':
            log_questions_table = 'pds_log_questions'
            feedback_table = 'pds_feedback'
            question_processing_log_table = 'pds_question_processing_log'
        case 'Remittance':
            log_questions_table = 'remittance_log_questions'
            feedback_table = 'remittance_feedback'
            question_processing_log_table = 'remittance_question_processing_log'
        case 'MINI':  # MINI
            log_questions_table = 'mini_log_questions'
            feedback_table = 'mini_feedback'
            question_processing_log_table = 'mini_question_processing_log'
        case _:
            return None

    def time_unit_query(alias='', name='time'):
        """
        Return the query string according to the time unit
        """
        if alias:
            alias += '.'

        if time_unit == 'day':
            return f"date_format({alias}create_{name}, '%Y-%m-%d')"
        if time_unit == 'week':
            return f"concat(year({alias}create_{name}), '-', week({alias}create_{name}), '周')"
        if time_unit == 'month':
            return f"concat(year({alias}create_{name}), '-', month({alias}create_{name}))"
        raise KeyError('The time unit can only be one of `day`, `week` and `month`.')

    # 点赞点踩数/率
    if 'like' in indicator:
        like_query = 'dislike' if 'dislike' in indicator else 'like'
        query = \
            f"""
            select date, sum(all_count) as all_count, sum(like_count) as like_count, ifnull(sum(like_count)/sum(all_count), 0)
            from (
                select {time_unit_query('lq')} as date, count(*) as all_count, 0 as like_count from {log_questions_table} lq 
                where lq.create_time between %s and %s {role_version_query('lq')}
                group by date
                union all
                select {time_unit_query('lq')} as date, 0 as all_count, count(lq.id) as like_count from {log_questions_table} lq
                join {feedback_table} f on lq.id = f.question_id
                where lq.create_time between %s and %s 
                {role_version_query('lq')} and f.liked = '{like_query}'
                group by date
            ) a
            group by date
            """
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute(query, params=[time_period[0], time_period[1], time_period[0], time_period[1]])
            records = cur.fetchall()
            data = []
            for record in records:
                unit, _, num_likes, rate_likes = record
                data.append({
                    'time_unit': unit,
                    f'num_{like_query}s': int(num_likes),
                    f'rate_{like_query}s': float(rate_likes)
                })
        except Exception as e:
            app.logger.error(
                f"An error occurred when querying trend analysis data for dashboard: {e}")
            return None
        finally:
            con.close()

    elif indicator in (
            'num_chats', 'num_questions', 'num_users', 'num_external_questions', 'num_external_users',
            'avg_num_questions',
            'avg_time_chats'):
        query1 = \
            f"""
            select {time_unit_query()} as date, 
            count(distinct chat_id) as num_chats, 
            count(distinct if(robot_response_time is not null, chat_id, null)) as num_chats_with_response_time,
            count(*) as num_questions, 
            count(distinct email) as num_users, 
            sum(robot_response_time) as time_chats
            from {log_questions_table}
            where create_time between %s and %s {role_version_query()}
            group by date
            """

        email_query_list = [f'and email not like "%{x}"' for x in INTERNAL_EMAIL_SUFFIX]
        email_query = ' '.join(email_query_list)
        query2 = \
            f"""
            select {time_unit_query()} as date,
            count(*) as num_external_questions,
            count(distinct email) as num_external_users
            from {log_questions_table}
            where create_time between %s and %s {role_version_query()} {email_query}
            group by date
            """
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute(query1, params=[time_period[0], time_period[1]])
            records1 = cur.fetchall()

            cur.execute(query2, params=[time_period[0], time_period[1]])
            records2 = cur.fetchall()

            data = []
            for record1, record2 in zip(records1, records2):
                (unit, num_chats, num_chats_with_response_time, num_questions, num_users, time_chats), \
                    (_, num_external_questions, num_external_users) = record1, record2
                data.append({
                    'time_unit': unit,
                    'num_chats': int(num_chats),
                    'num_questions': int(num_questions),
                    'num_users': int(num_users),
                    'num_external_questions': int(num_external_questions),
                    'num_external_users': int(num_external_users),
                    'avg_num_questions': num_questions / num_chats if num_chats != 0 else 0,
                    # 'avg_time_chats': time_chats / num_chats if num_chats != 0 else 0,
                    'avg_time_chats': time_chats / num_chats_with_response_time if num_chats_with_response_time != 0 else 0
                })

        except Exception as e:
            app.logger.error(
                f"An error occurred when querying trend analysis data for dashboard: {e}")
            return None
        finally:
            con.close()

    elif indicator in ('num_email_updates', 'avg_num_email_updates'):
        query = \
            f"""
            select date, sum(num_email_updates) as num_email_updates, sum(num_dislikes) as num_dislikes, ifnull(sum(num_email_updates)/sum(num_dislikes), 0)
            from (
                select {time_unit_query(name='datetime')} as date, 0 as num_email_updates, count(*) as num_dislikes
                from {feedback_table} 
                where liked = "dislike" and create_datetime between %s and %s {role_version_query()}
                group by date
                union all
                select {time_unit_query(name='datetime')} as date, count(require_email_update) as num_email_updates, 0 as num_dislikes
                from {feedback_table} 
                where require_email_update = "Y" and create_datetime between %s and %s {role_version_query()}
                group by date
                ) a
            group by date
            """
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute(query, params=[time_period[0], time_period[1], time_period[0], time_period[1]])
            records = cur.fetchall()
            data = []
            for record in records:
                unit, num_email_updates, _, avg_num_email_updates = record
                data.append({
                    'time_unit': unit,
                    'num_email_updates': int(num_email_updates),
                    'avg_num_email_updates': float(avg_num_email_updates),
                })
        except Exception as e:
            app.logger.error(
                f"An error occurred when querying trend analysis data for dashboard: {e}")
            return None
        finally:
            con.close()

    elif indicator in ('num_answers', 'rate_answers', 'avg_time_response'):
        query = \
            f"""
            select date, 
            sum(num_answers) as num_answers, 
            sum(num_answers_with_response_time) as num_answers_with_response_time, 
            sum(num_questions) as num_questions, 
            ifnull(sum(num_answers)/sum(num_questions), 0) as rate_answers,
            # sum(time_response)/sum(num_answers) as avg_time_response
            ifnull(sum(time_response)/sum(num_answers_with_response_time) ,0) as avg_time_response
            from (
                select {time_unit_query(alias='lq')} as date, 
                count(lq.answer) as num_answers, 
                count(if(lq.robot_response_time is not null, lq.answer, null)) as num_answers_with_response_time,
                sum(lq.robot_response_time) as time_response,
                0 as num_questions
                from {log_questions_table} lq join {question_processing_log_table} qpl 
                on lq.id = qpl.question_id
                where lq.create_time between %s and %s {role_version_query('lq')}
                and qpl.status = "PASSED"
                group by date
                union all
                select {time_unit_query(alias='lq')} as date, 
                0 as num_answers, 
                0 as num_answers_with_response_time,
                0 as time_response,
                count(*) as num_questions
                from {log_questions_table} lq
                where lq.create_time between %s and %s {role_version_query('lq')}
                group by date
                ) a
            group by date
            """
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute(query, params=[time_period[0], time_period[1], time_period[0], time_period[1]])
            records = cur.fetchall()
            data = []
            for record in records:
                unit, num_answers, _, _, rate_answers, avg_time_response = record
                data.append({
                    'time_unit': unit,
                    'num_answers': int(num_answers),
                    'rate_answers': float(rate_answers),
                    'avg_time_response': float(avg_time_response)
                })
        except Exception as e:
            app.logger.error(
                f"An error occurred when querying trend analysis data for dashboard: {e}")
            return None
        finally:
            con.close()

    elif indicator in ('rate_infosec_failed',):
        query = \
            f"""
            select {time_unit_query(alias='qpl')} as date, count(*) as num_all_questions, 
            sum(case when status_message = "INFOSEC_CHECK_QUESTION_FAILED" then 1 else 0 end) as num_infosec_failed
            from {question_processing_log_table} qpl
            where qpl.create_time between %s and %s
            group by date
            """
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute(query, params=[time_period[0], time_period[1]])
            records = cur.fetchall()
            data = []
            for record in records:
                unit, num_all_questions, num_infosec_failed = record
                data.append({
                    'time_unit': unit,
                    'rate_infosec_failed': float(
                        num_infosec_failed / num_all_questions if num_all_questions != 0 else 0),
                })
        except Exception as e:
            app.logger.error(
                f"An error occurred when querying trend analysis data for dashboard: {e}")
            return None
        finally:
            con.close()
    else:
        return {"message": f"The indicator `{indicator}` is not supported yet."}, 400

    return data


def get_keywords(top_k, time_period, role, version, keyword, product_line):
    """
    Get keywords for Dashboard
    """

    def role_version_query(alias=''):
        """
        Return the query string according to the role and the version
        """
        if alias:
            alias += '.'

        if role == 'All' and version != 'All':
            role_query = ''
            version_query = f'and {alias}version = "{version}"'
        elif role != 'All' and version == 'All':
            role_query = f'and {alias}role = "{role}"'
            version_query = ''
        elif role == 'All' and version == 'All':
            role_query = ''
            version_query = ''
        else:
            role_query = f'and {alias}role = "{role}"'
            version_query = f'and {alias}version = "{version}"'
        return f'{role_query} {version_query}'

    match product_line:
        case 'Alipay+':
            log_questions_table = 'log_questions'
            feedback_table = 'feedback'
        case 'PDS':
            log_questions_table = 'pds_log_questions'
            feedback_table = 'pds_feedback'
        case 'Remittance':
            log_questions_table = 'remittance_log_questions'
            feedback_table = 'remittance_feedback'
        case 'MINI':  # MINI
            log_questions_table = 'mini_log_questions'
            feedback_table = 'mini_feedback'
        case _:
            return None
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor()

        if keyword == 'feedback':
            query = f'select feedback from {feedback_table} where create_datetime between %s and %s {role_version_query()} ' \
                    f'and feedback != ""'
        elif keyword == 'question':
            query = f'select question from {log_questions_table} where create_time between %s and %s {role_version_query()} ' \
                    f'and question != ""'
        else:
            raise KeyError(f'The keyword `{keyword}` is not supported.')

        cur.execute(query, [time_period[0], time_period[1]])
        records = cur.fetchall()
        words = ''
        for record in records:
            feedback = record[0]
            words += f' {feedback}'
        data = Counter(aiutils.cut_words(words, use_stop_words=True)).most_common(top_k)
    except Exception as e:
        app.logger.error(
            f"An error occurred when querying feedback or question keywords for dashboard: {e}")
        return None
    finally:
        con.close()

    return data


def get_questions(top_k, time_period, role, version, product_line):
    """
    Get questions for Dashboard
    """

    def role_version_query(alias=''):
        """
        Return the query string according to the role and the version
        """
        if alias:
            alias += '.'

        if role == 'All' and version != 'All':
            role_query = ''
            version_query = f'and {alias}version = "{version}"'
        elif role != 'All' and version == 'All':
            role_query = f'and {alias}role = "{role}"'
            version_query = ''
        elif role == 'All' and version == 'All':
            role_query = ''
            version_query = ''
        else:
            role_query = f'and {alias}role = "{role}"'
            version_query = f'and {alias}version = "{version}"'
        return f'{role_query} {version_query}'

    match product_line:
        case 'Alipay+':
            question_embeddings_table = 'question_embeddings'
        case 'PDS':
            question_embeddings_table = 'pds_question_embeddings'
        case 'Remittance':
            question_embeddings_table = 'remittance_question_embeddings'
        case 'MINI':
            question_embeddings_table = 'mini_question_embeddings'
        case _:  # MINI
            return None

    query = f'select question, embedding from {question_embeddings_table} ' \
            f'where create_time between %s and %s {role_version_query()}'
    try:
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        conn = pool.get_connection()
        df: pd.DataFrame = pd.read_sql(
            sql=query,
            params=(time_period[0], time_period[1]),
            con=conn
        )
        data = app_utils.get_similar_question_clustering(df, top_k)
    except Exception as e:
        app.logger.error(
            f"An error occurred when querying questions for dashboard: {e}")
        return None
    finally:
        conn.close()

    return data


# endregion

# region ================================================ ES API Funcs =================================================
MAPPINGS = {
    "properties": {
        "content": {
            "type": "text"
        },
        "features": {
            "type": "dense_vector",
            "dims": 1536
        }}}
SETTINGS = {
    "settings": {
        "number_of_replicas": 1,
        "number_of_shards": 1
    },
    "mappings": MAPPINGS
}

client = pool.es_client
engine = pool.db_engine


def migrate_es(tenants, batch_size):
    """从knowledge_base正式表完整迁移所有指定tenant的知识库"""
    try:
        for tenant in tenants:
            _, db_table = app_utils.get_table_name_by_tenant(tenant)
            roles = app_utils.get_role_by_tenant(tenant)
            try:
                client.indices.create(index=db_table, body=SETTINGS)
            except Exception as e:
                app.logger.warning(f'The index {db_table} already exists: {e}.')
                continue

            for role in roles:
                columns = 'id, title, heading, category, product, sub_product, role, content, url, features, version, md5, operator, comments, source, updated, to_be_inherited'

                if tenant == 'ALIPAYPLUS':
                    version_dicts = pool.get_version_list_by_role(role).to_dict(orient='records')
                    versions = [version_dict['value'] for version_dict in version_dicts]
                    for version in versions:
                        query = f'select {columns} from {db_table} where role = %s and version = %s'
                        app.logger.info(f'Fetching knowledge from MySQL: `{db_table}/{role}/{version}`')
                        df = pd.read_sql(
                            sql=query,
                            params=(role, version),
                            con=engine
                        )
                        app.logger.info(f'Writing knowledge into ES: `{db_table}/{role}/{version}`')
                        app_utils.write_es(client, db_table, df, batch_size)

                else:
                    latest_version = pool.get_latest_version(db_table).loc[role]["version"]
                    query = f'select {columns} from {db_table} where role = %s and version = %s'
                    app.logger.info(f'Fetching knowledge from MySQL: `{db_table}/{role}/{latest_version}`')
                    df = pd.read_sql(
                        sql=query,
                        params=(role, latest_version),
                        con=engine
                    )
                    app.logger.info(f'Writing knowledge into ES: `{db_table}/{role}/{latest_version}`')
                    app_utils.write_es(client, db_table, df, batch_size)

    except Exception as e:
        raise Exception(f'Failed to migrate knowledge base for the following tenants: {tenants}.\nError:{e}')
    return f'Successfully migrated knowledge base for the following tenants`: {tenants}.'


def delete_es_index(tenant: str):
    _, es_index = app_utils.get_table_name_by_tenant(tenant)
    try:
        res = client.indices.delete(index=es_index)
    except Exception as e:
        raise Exception(f"The index {es_index} doesn't exist: {e}")
    return f'The ES index `{es_index}` has been deleted: {res["acknowledged"]}.'


def check_es_index(tenant: str):
    """检查ES中的知识数量是否和MySQL中一致"""
    _, es_index = app_utils.get_table_name_by_tenant(tenant)
    if tenant == 'ALIPAYPLUS':
        query = f'select count(*) from {es_index}'
        df: pd.DataFrame = pd.read_sql(query, engine)
    else:
        latest_version = pool.get_latest_version(es_index).loc[tenant]["version"]
        query = f'select count(*) from {es_index} where version = %s'
        df: pd.DataFrame = pd.read_sql(
            sql=query,
            params=(latest_version,),
            con=engine
        )
    db_doc_count = df.values[0][0]
    response = client.cat.count(index=es_index, format="json")
    es_doc_count = int(response[0]['count'])
    app.logger.debug(f'db_doc_count: {db_doc_count}, es_doc_count: {es_doc_count}')

    if db_doc_count == es_doc_count:
        return f'ES index `{es_index}` migration done: {es_doc_count / db_doc_count * 100:.2f}% ({es_doc_count}/{db_doc_count}).'
    # ES index `{es_index}` migration in progress: 23.55% (1324/5621).
    return f'ES index `{es_index}` migration in progress: {es_doc_count / db_doc_count * 100:.2f}% ({es_doc_count}/{db_doc_count}).'
# endregion
