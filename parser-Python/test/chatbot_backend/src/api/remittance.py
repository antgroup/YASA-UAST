# coding: utf-8
import os
import time

from flask import Blueprint, g, request, current_app as app

from src import app_service
from src import app_utils
from src.TokenManager import require_token
from src.db_pool import pool
from src.app_utils import validate_input

DBTABLE_KNOWLEDGE_BASE = os.getenv('DBTABLE_REMITTANCE_KNOWLEDGE_BASE')
DBTABLE_QUESTION_LOG = os.getenv('DBTABLE_REMITTANCE_LOG_QUESTIONS')
DBTABLE_QUESTION_PROCESSING_LOG = os.getenv('DBTABLE_REMITTANCE_QUESTION_PROCESSING_LOG')
DBTABLE_QUESTION_FEEDBACK = os.getenv('DBTABLE_REMITTANCE_FEEDBACK')
REMITTANCE_PRODUCT_LINE = os.getenv('REMITTANCE_PRODUCT_LINE')
REMITTANCE_DB_TABLES = {
    'LOG_QUESTIONS': DBTABLE_QUESTION_LOG,
    'KNOWLEDGE_BASE': DBTABLE_KNOWLEDGE_BASE,
    'QUESTION_PROCESSING_LOG': DBTABLE_QUESTION_PROCESSING_LOG,
    'FEEDBACK': DBTABLE_QUESTION_FEEDBACK,
}
COMPLETIONS_MODEL = os.getenv('COMPLETIONS_MODEL')
ES_MODE = os.getenv('ES_MODE')

bp = Blueprint('remittance', __name__, url_prefix='/')


# request params: question, chat_id, role, product, version
@bp.route("/api/remittance/v2/question", methods=["POST"])
@require_token
@validate_input
def index_v2(username, email):
    # required: question, chat_id
    chat_id = app_utils.generate_chat_id(request)
    question_original = request.get_json()["question"]  # [SOURCE]
    model = request.json.get('model', COMPLETIONS_MODEL)  # [SOURCE]
    app.logger.info(f'The model `{model}` is in use.')
    es_mode = request.json.get('es_mode', ES_MODE)
    app.logger.info(f'The es_mode `{es_mode}` is in use.')
    start_time = time.time()
    app.logger.debug(f"Received request at {start_time}")

    # check if question is empty, too long or contain non-Chinese and non-English
    app_utils.check_question_length_and_language(question_original, username)

    # check sensitive information by openai api and info_sec
    is_passed = app_utils.check_sensitive_info(
        question_original, username, app, is_remittance=True)
    if not is_passed:
        g.question_text = question_original
        raise Exception("INFOSEC_CHECK_QUESTION_FAILED")

    app.logger.info("desensitized question: " + question_original)
    version_list = pool.get_latest_version(db_table=DBTABLE_KNOWLEDGE_BASE)

    # optional: role, product, version, if not set, use default value,
    role, product, version = app_utils.set_role_product_version(
        request, app, version_list, is_remittance=True)

    detected_products = app_utils.visiting_url_and_product_detected(request, app, question_original,
                                                                    product, username, chat_id)

    data = app_service.question_index_v2(
        username, email, start_time, role, product, version, chat_id,
        detected_products, question_original, db_tables=REMITTANCE_DB_TABLES, es_mode=es_mode, model=model,
        product_line=REMITTANCE_PRODUCT_LINE, is_remittance=True
    )
    return data, 200


@bp.route("/api/remittance/v2/questionStream", methods=["POST"])
@require_token
@validate_input
def index_v2_stream(username, email):
    chat_id = app_utils.generate_chat_id(request)
    question_original = request.get_json()["question"]  # [SOURCE]
    model = request.json.get('model', COMPLETIONS_MODEL)  # [SOURCE]
    app.logger.info(f'The model `{model}` is in use.')
    es_mode = request.json.get('es_mode', ES_MODE)
    app.logger.info(f'The es_mode `{es_mode}` is in use.')

    start_time = time.time()
    app.logger.debug(f"Received request at {start_time}")

    # check if question is empty, too long or contain non-Chinese and non-English
    app_utils.check_question_length_and_language(question_original, username)

    # check sensitive information by openai api and info_sec
    is_passed = app_utils.check_sensitive_info(
        question_original, username, app, is_remittance=True)
    if not is_passed:
        g.question_text = question_original
        raise Exception("INFOSEC_CHECK_QUESTION_FAILED")

    app.logger.info("desensitized question: " + question_original)
    version_list = pool.get_latest_version(db_table=DBTABLE_KNOWLEDGE_BASE)

    # optional: role, product, version, if not set, use default value,
    role, product, version = app_utils.set_role_product_version(
        request, app, version_list, is_remittance=True)

    detected_products = app_utils.visiting_url_and_product_detected(request, app, question_original,
                                                                    product, username, chat_id)
    data = app_service.question_stream_index_v2(
        username, email, start_time, role, product, version, chat_id,
        detected_products, question_original, db_tables=REMITTANCE_DB_TABLES, es_mode=es_mode, model=model,
        product_line=REMITTANCE_PRODUCT_LINE, is_remittance=True
    )
    return data


@bp.after_request
def log_question_for_analysis(response):
    """
        Logs the question and answer for analysis.
        """
    # only log if the endpoint is the main endpoint
    if request.endpoint in ['remittance.index_v2', 'remittance.index_v2_stream']:
        app_service.log_question_for_analysis(db_table=DBTABLE_QUESTION_PROCESSING_LOG)
        return response
    return response


# Feedback
@bp.route('/api/remittance/v2/feedback', methods=['POST'])
@require_token
@validate_input
def feedback(username, email):
    # Get the request data
    data = request.get_json()
    # Extract feedback and other information from the request
    user_email = data.get('user_email') or ''
    question_id = data.get('question_id')
    liked = data.get('liked') or ''
    feedback = data.get('feedback')
    require_email_update = data.get('require_email_update') or "N"
    feedback_email = data.get('feedback_email') or ''

    app.logger.info({"username": username, "user_email": user_email, "question_id": question_id, "feedback": feedback,
                     "require_email_update": require_email_update, "feedback_email": feedback_email, "liked": liked})

    data = app_service.get_feedback(username, email, user_email, question_id, liked, feedback, require_email_update,
                                    feedback_email, is_remittance=True)
    return data
