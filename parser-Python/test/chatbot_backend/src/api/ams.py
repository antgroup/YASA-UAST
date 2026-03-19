# coding: utf-8
import json
import os
import traceback
from functools import wraps

import requests
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g, Response, Blueprint, stream_with_context
from flask_cors import CORS

from src import aiutils
from src import app_service
from src import app_utils, ams_utils
from src.TokenManager import TokenManager
from src.ams_utils import compose_ilmservice_headers, compose_ilmservice_request, ALIPAY_PLUS_ROOM_ID, LINKS_APP_SECRET, \
    LINKS_APP_KEY, compose_rewards_headers, compose_rewards_request
from src.db_pool import pool
from src.streamutils import ams_generator, ams_generator2, ams_rewards_generator, gpa_generator2
from src.app_utils import validate_input
load_dotenv()

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
app.logger.setLevel("DEBUG")
CORS(app)
os.environ["TOKENIZERS_PARALLELISM"] = "false"



# database reloading status
db_is_reloading = False

# the minimal similarity between the input and the document
MINIMAL_DOCUMENT_SIMILARITY = 0.75
# the minimal similarity between the input and the document for specific question(any product detected in the question)
MINIMAL_DOCUMENT_SIMILARITY_FOR_SPECIFIC_QUESTION = 0.65
# the minimum similarity between the question and the previous question
THRESHOLD_SIMILARITY = 0.75
# the minial similarity difference
MAXMUM_DIFF_TO_USE = 0.05
# the maximum number of tokens in the input
MAX_INPUT_TOKENS = 200
# infoSec check app scenario
INFOSEC_APPSCENE_ONLINE_QNA = "online_qna"
INFOSEC_APPSCENE_QNA_BOT = "qna_bot"
AMS_PRODUCT_LINE = os.getenv('AMS_PRODUCT_LINE')
INTERNAL_EMAIL_SUFFIX = eval(os.getenv('INTERNAL_EMAIL_SUFFIX'))
AMS_DB_TABLES = {
    'LOG_QUESTIONS': 'ams_log_questions_v2',
    'KNOWLEDGE_BASE': 'ams_knowledge_base_v3',
    'QUESTION_PROCESSING_LOG': 'ams_question_processing_log',
    'FEEDBACK': 'ams_feedback',
}
bp = Blueprint('ams', __name__, url_prefix='/')

ams_df, ams_document_embeddings = pool.load_ams_data()

ILMSERVICE_URL = f"https://ilmservice.alipay.com/api/v1/open/flow/service"

# check the session token is valid or not
def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 检查请求头
        if request.headers.get('sense') == "SA":
            kwargs['username'] = "SA"
            kwargs['email'] = "saanddeveloper@antom.com"
            return f(*args, **kwargs)

        token = request.headers.get("token")
        result = TokenManager.validate_token(token)
        if result['result_code'] != 'S':
            app.logger.info(result)
            return jsonify(result), 403
        kwargs['username'] = result['username']
        kwargs['email'] = result['email']
        return f(*args, **kwargs)

    return decorated_function


# ams question
@bp.route("/api/ams/v2/question", methods=["POST"])
@require_token
@validate_input
def ams_index_v2(username, email):
    question_original = app_utils.replace_keywords(request, username, '')
    # step 1: if the question is empty, return the default answer
    if not question_original:
        g.status = "REJECTED"
        g.status_message = "EMPTY_QUESTION"
        return {"answer": "Dear, Please ask me a question."}, 200

    # sensitive info check
    app_utils.check_sensitive_info(question_original, username, app)
    # the question should be checked by infoSec
    app_utils.info_sec_check(question_original, username, app)
    app.logger.info("desensitized question: " + question_original)

    product, sub_product = app_utils.set_ams_product(request)

    chat_id = app_utils.generate_chat_id(request)

    # visiting_url and product detected
    detected_products = app_utils.visiting_url_and_product_detected(request, app, question_original,
                                                                    product, username, chat_id)

    # record = app_utils.find_ams_record_by_chat_id(chat_id)

    # LOAD DATA
    ams_df, ams_document_embeddings = pool.load_ams_data()

    # filter the document embeddings by product, version and role
    filtered_document_embeddings = aiutils.ams_filter_embeddings(
        ams_document_embeddings, product, sub_product)

    answer, chosen_sections_indexes, _, _, prompt, chat_id, _ = app_service.deal_with_chat(
        product_line=AMS_PRODUCT_LINE,
        db_tables=AMS_DB_TABLES,
        chat_id=chat_id,
        detected_products=detected_products,
        question_original=question_original,
        filtered_document_embeddings=filtered_document_embeddings,
        es_mode='none',
        username=username,
        df=ams_df)

    # get relevant knowledge list
    relevant_content_list = aiutils.get_the_answer_relevant_content_list(
        answer, chosen_sections_indexes, filtered_document_embeddings)
    relevant_knowledge_links = aiutils.get_answer_relevant_knowledge(
        relevant_content_list, ams_df)

    # store the question and answer to the database
    answer_data_string = json.dumps( 
        {"further_reading": relevant_knowledge_links, "answer": answer})
    further_reading = json.dumps(relevant_knowledge_links)

    question_id = app_service.ams_store_question_and_answer(
        username, email, question_original, answer_data_string, further_reading, prompt, chat_id, product, '')

    # if question_id is None, failed to insert
    if question_id is None:
        app.logger.error("question insertion error")
        g.status = "REJECTED"
        g.status_message = "QUESTION_INSERTION_ERROR"
        raise Exception("QUESTION_INSERTION_ERROR")

    g.question_text = question_original
    g.answer_text = answer
    g.chat_id = chat_id
    g.status = "PASSED"
    g.status_message = "OK"
    g.question_id = question_id
    g.question_context_similarity = chosen_sections_indexes
    g.answer_context_similarity = relevant_content_list
    g.prompt = prompt

    return {"answer": answer, "chat_id": chat_id, "further_reading": relevant_knowledge_links,
            "question_id": question_id}, 200


@bp.route("/api/ams/v2/questionStream", methods=["POST"])
@require_token
@validate_input
def ams_index_v3_2(username, email):
    question_original = app_utils.replace_keywords(request, username, '') 
    # step 1: if the question is empty, return the default answer
    if not question_original:
        g.status = "REJECTED"
        g.status_message = "EMPTY_QUESTION"
        return {"answer": "Dear, Please ask me a question."}, 200

    chat_id = app_utils.generate_chat_id(request)

    # sensitive info check
    is_passed = app_utils.check_sensitive_info(question_original, username, app)
    if not is_passed:
        return {"message": "Sorry, I could only answer questions related to Alipay+ integration.",
                "chat_id": chat_id}, 400

    app.logger.info("desensitized question: " + question_original)

    product, sub_product = app_utils.set_ams_product(request)

    # visiting_url and product detected
    detected_products = app_utils.visiting_url_and_product_detected(request, app, question_original,
                                                                    product, username, chat_id)

    # filter the document embeddings by product, version and role
    filtered_document_embeddings = aiutils.ams_filter_embeddings(ams_document_embeddings, product, sub_product)

    chat_req, chosen_sections_indexes, prompt = app_service.ams_deal_with_stream_chat(
        detected_products, question_original,
        filtered_document_embeddings,
        username, ams_df, chat_id)

    headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
    }

    return Response(ams_generator(chat_req, question_original, username, 
                                  chosen_sections_indexes, filtered_document_embeddings, 
                                  ams_df, email, chat_id, prompt, product, INFOSEC_APPSCENE_QNA_BOT),
                    mimetype="text/event-stream", headers=headers)


@bp.route("/api/ams/newTalk", methods=["POST"])
@require_token
@validate_input
def ams_question_newTalk(username, email): 
    """
    ams数字人对话接口
    """

    # 解码userId&获取userName
    username = ams_utils.decode_base64(username)
    userId = username.split('ac:')[1] if 'ac:' in username else username 

    # 获取提问问题
    question = request.get_json()["question"] 
    sessionId = request.get_json()["chat_id"]
    submitType = request.get_json()["submit_type"] if 'submit_type' in request.get_json().keys() else ''
    app.logger.info("the user " + userId + " question is: " + question + "submitType: " + submitType)

    # 组装llmService请求头
    llmService_headers = compose_ilmservice_headers()

    # 组装llmService请求体
    llmService_request = compose_ilmservice_request(question, userId, sessionId)
    app.logger.info("create ilmservice request compose success!")

    try:
        response = requests.post(ILMSERVICE_URL, headers=llmService_headers, json=llmService_request, stream=True)
        # 如果HTTP请求返回了一个失败状态码，将产生一个异常
        response.raise_for_status()
        app.logger.info("create ilmservice request success!")

    except requests.RequestException as e:
        app.logger.error(f"Error while creating conversation: {e}")
        traceback.print_exc()
        return {"message": "Failed to request llm due to an error with the request."}, 500

    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return {"message": "An unexpected error occurred."}, 500

    stream_headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
    }

    return Response(stream_with_context(ams_generator2(response, username, email, question, submitType)), 
                    mimetype="text/event-stream", 
                    headers=stream_headers) 


@bp.route("/api/ams/rewardsTalk", methods=["POST"])
@require_token
@validate_input
def rewardsTalk(username, email):
    """
    rewards对话接口
    """

    # 解码userId&获取userName
    username = ams_utils.decode_base64(username)
    userId = username.split('ac:')[1] if 'ac:' in username else username

    # 获取提问问题
    question = request.get_json()["question"]
    sessionId = request.get_json()["chat_id"]
    app.logger.info("the user " + userId + " question is: " + question)

    # 组装llmService请求头
    llmService_headers = compose_rewards_headers()

    # 组装llmService请求体
    llmService_request = compose_rewards_request(question, userId, sessionId)
    app.logger.info("create ilmservice request compose success!")

    try:
        response = requests.post(ILMSERVICE_URL, headers=llmService_headers, json=llmService_request, stream=True)
        # 如果HTTP请求返回了一个失败状态码，将产生一个异常
        response.raise_for_status()
        app.logger.info("create ilmservice request success!")

    except requests.RequestException as e:
        app.logger.error(f"Error while creating conversation: {e}")
        traceback.print_exc()
        return {"message": "Failed to request llm due to an error with the request."}, 500

    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return {"message": "An unexpected error occurred."}, 500

    stream_headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
    }

    return Response(stream_with_context(ams_rewards_generator(response, username, email, question)), 
                    mimetype="text/event-stream", 
                    headers=stream_headers) 


@bp.route("/api/ams/createLinksToken", methods=["POST"])
@require_token
@validate_input
def ams_create_links_token(username, email):
    """
        创建研发小蜜token
    """
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "LinksAuthToken": ams_utils.build_links_auth_token(LINKS_APP_KEY, LINKS_APP_SECRET)
    }
    url = f"https://links-openapi.alipay.com/openapi/room/{ALIPAY_PLUS_ROOM_ID}/token/create"
    body = {
        "userId": username,
        "userName": email,
        "accountSystem": "ANTOM",
        "roomId": ALIPAY_PLUS_ROOM_ID
    }

    try:
        response = requests.post(url, headers=headers, json=body)
        # 如果HTTP请求返回了一个失败状态码，将产生一个异常
        response.raise_for_status()
        app.logger.info("User successfully created token.")
        app.logger.debug(response.json())
        token = response.json().get("result")

    except requests.RequestException as e:
        app.logger.error(f"Error while creating conversation: {e}")
        traceback.print_exc()
        return {"message": "Failed to create token due to an error with the request."}, 500

    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return {"message": "An unexpected error occurred."}, 500

    return ({"token": token}, 200) if token is not None else ({"message": "create links token failed"}, 404)


@bp.route("/api/gpa/newTalk", methods=["POST"])
@require_token
@validate_input
def gpa_question_newTalk(username, email): 
    """
    gpa数字人对话接口
    """

    # 解码userId&获取userName
    username = ams_utils.decode_base64(username)
    userId = username.split('ac:')[1] if 'ac:' in username else username  

    # 获取提问问题
    question = request.get_json()["question"] 
    sessionId = request.get_json()["chat_id"]
    app.logger.info("the user " + userId + " question is: " + question)

    # 组装llmService请求头
    llmService_headers = ams_utils.compose_gpa_campaign_ilmservice_headers()

    # 组装llmService请求体
    llmService_request = ams_utils.compose_gpa_campaign_ilmservice_request(question, userId, sessionId)
    app.logger.info("create ilmservice request compose success!")

    try:
        response = requests.post(ILMSERVICE_URL, headers=llmService_headers, json=llmService_request, stream=True)
        # 如果HTTP请求返回了一个失败状态码，将产生一个异常
        response.raise_for_status()
        app.logger.info("create ilmservice request success!")

    except requests.RequestException as e:
        app.logger.error(f"Error while creating conversation: {e}")
        traceback.print_exc()
        return {"message": "Failed to request llm due to an error with the request."}, 500

    except Exception as e:
        app.logger.error(f"An unexpected error occurred: {e}")
        traceback.print_exc()
        return {"message": "An unexpected error occurred."}, 500

    stream_headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
    }

    return Response(stream_with_context(gpa_generator2(response, username, email, question)), 
                    mimetype="text/event-stream", 
                    headers=stream_headers) 
