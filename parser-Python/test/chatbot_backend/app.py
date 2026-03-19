# coding: utf-8
import os
import time
import traceback


from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
from flask_cors import CORS

from src import aiutils
from src import app_service
from src import app_utils
from src.TokenManager import require_token
from src.api import dashboard, miniprogram, pds, remittance, ams
from src.app_utils import validate_input
from src.db_pool import pool


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
MAXIMUM_DIFF_TO_USE = 0.05
# the maximum number of tokens in the input
MAX_INPUT_TOKENS = 200
# infoSec check app scenario
INFOSEC_APPSCENE_ONLINE_QNA = "online_qna"
INFOSEC_APPSCENE_QNA_BOT = "qna_bot"
ALIPAY_PLUS_PRODUCT_LINE = os.getenv('ALIPAY_PLUS_PRODUCT_LINE')
AMS_PRODUCT_LINE = os.getenv('AMS_PRODUCT_LINE')
INTERNAL_EMAIL_SUFFIX = eval(os.getenv('INTERNAL_EMAIL_SUFFIX'))
COMPLETIONS_MODEL = os.getenv('COMPLETIONS_MODEL')
ES_MODE = os.getenv('ES_MODE')
ES_QUERY_SIZE = os.getenv('ES_QUERY_SIZE')
DEBUGGER_ES_QUERY_SIZE = os.getenv('DEBUGGER_ES_QUERY_SIZE')
CODE_GENERATOR_ES_QUERY_SIZE = os.getenv('CODE_GENERATOR_ES_QUERY_SIZE')
ES_QUERY_SIZE_MAPPING = {
    "DocsAI": int(ES_QUERY_SIZE),
    "Debugger": int(DEBUGGER_ES_QUERY_SIZE),
    "Code Generator": int(CODE_GENERATOR_ES_QUERY_SIZE)
}

DB_TABLES = {
    'LOG_QUESTIONS': 'log_questions',
    'KNOWLEDGE_BASE': 'knowledge_base',
    'QUESTION_PROCESSING_LOG': 'question_processing_log',
    'FEEDBACK': 'feedback',
}

app.register_blueprint(dashboard.bp)
app.register_blueprint(ams.bp)
app.register_blueprint(miniprogram.bp)
app.register_blueprint(pds.bp)
app.register_blueprint(remittance.bp)

ams_df, ams_document_embeddings = pool.load_ams_data()


@app.route("/", methods=["GET"])
def hello():
    return "hello", 200


@app.route("/api/login", methods=["POST"])
def login():
    request_body = request.get_json()
    # deal with the access_token from Dingtalk JS/developer center and require the user to register email.
    app.logger.info(request_body)
    data = app_service.login(request_body)
    return data

# if the user is from developer center, the user need to provide email binding to username to receive feedback for first time
@app.route("/api/update_email", methods=["POST"])
@require_token
@validate_input
def update_email(username, email):
    data = app_service.update_email(request, username, email)
    return data


# request params: question, chat_id, role, product, version
@app.route("/api/v2/question", methods=["POST"])
@require_token
@validate_input
def index_v2(username, email):
    # required: question, chat_id
    chat_id = app_utils.generate_chat_id(request)
    question_original = request.get_json()["question"]  # [SOURCE]
    model = request.json.get('model', COMPLETIONS_MODEL)  # [SOURCE]
    es_mode = request.json.get('es_mode', ES_MODE)
    robot_type = request.json.get('robot_type', 'DocsAI')
    es_query_size = request.json.get('es_query_size', ES_QUERY_SIZE_MAPPING[robot_type])
    data_source = request.json.get('data_source')
    start_time = time.time()
    app.logger.debug(f'The robot_type `{robot_type}` is in use.')
    app.logger.debug(f'The model `{model}` is in use.')
    app.logger.debug(f'The es_mode `{es_mode}` is in use.')
    app.logger.debug(f"Received request at {start_time}")

    # check if question is empty, too long or contain non-Chinese and non-English
    app_utils.check_question_length_and_language(question_original, username)

    # check sensitive information by openai api and info_sec
    is_passed = app_utils.check_sensitive_info(
        question_original, username, app)
    if not is_passed:
        g.question_text = question_original
        raise Exception("INFOSEC_CHECK_QUESTION_FAILED")

    app.logger.info("desensitized question: " + question_original)
    version_list = pool.get_latest_version()

    # optional: role, product, version, if not set, use default value,
    role, product, version = app_utils.set_role_product_version(
        request, app, version_list)

    detected_products = app_utils.visiting_url_and_product_detected(request, app, question_original,
                                                                    product, username, chat_id)

    data = app_service.question_index_v2(
        username, email, start_time, role, product, version, chat_id,
        detected_products, question_original, db_tables=DB_TABLES, es_mode=es_mode, model=model, robot_type=robot_type,
        data_source=data_source, es_query_size=es_query_size
    )
    return data, 200


@app.route("/api/v2/questionStream", methods=["POST"])
@require_token
@validate_input
def index_v2_stream(username, email):
    chat_id = app_utils.generate_chat_id(request)
    question_original = request.json["question"]  # [SOURCE]
    model = request.json.get('model', COMPLETIONS_MODEL)  # [SOURCE]
    es_mode = request.json.get('es_mode', ES_MODE)  # none, hybrid, bm25 and cos_sim
    data_source = request.json.get('data_source')  # ALIPAY_DOCS, ALIPAY_DEV, FRONTEND_REVIEW
    robot_type = request.json.get('robot_type', 'DocsAI')  # DocsAI, Debugger, Code Generator
    es_query_size = request.json.get('es_query_size', ES_QUERY_SIZE_MAPPING[robot_type])
    integration_status = request.json.get('integration_status')
    start_time = time.time()

    app.logger.debug(f'The model `{model}` is in use.')
    app.logger.debug(f'The es_mode `{es_mode}` is in use.')
    app.logger.debug(f'The robot_type `{robot_type}` is in use.')
    app.logger.debug(f'The integration_status `{integration_status}` is in use.')
    app.logger.debug(f"Received request at {start_time}")

    # check if question is empty, too long or contain non-Chinese and non-English
    app_utils.check_question_length_and_language(question_original, username)

    # check sensitive information by openai api and info_sec
    is_passed = app_utils.check_sensitive_info(
        question_original, username, app)
    if not is_passed:
        g.question_text = question_original
        raise Exception("INFOSEC_CHECK_QUESTION_FAILED")

    # app.logger.info("desensitized question: " + question_original)
    version_list = pool.get_latest_version()

    # optional: role, product, version, if not set, use default value,
    role, product, version = app_utils.set_role_product_version(
        request, app, version_list)

    detected_products = app_utils.visiting_url_and_product_detected(request, app, question_original,
                                                                    product, username, chat_id)
    data = app_service.question_stream_index_v2(
        username, email, start_time, role, product, version, chat_id,
        detected_products, question_original, db_tables=DB_TABLES, es_mode=es_mode,
        model=model, robot_type=robot_type, data_source=data_source, es_query_size=es_query_size,
        integration_status=integration_status
    )
    return data


@app.route("/api/frontendReview", methods=["POST"])
@require_token
@validate_input
def frontend_review(username, email):
    params = request.form
    product = params['product']
    role = params['role']
    ssim_threshold = params['ssim_threshold']
    instruction = params['instruction']
    language = params.get('language', 'en')
    video = request.files.get('video')

    try:
        response = app_service.frontend_review(
            video,
            product=product,
            role=role,
            ssim_threshold=ssim_threshold,
            instruction=instruction,
            language=language,
            username=username,
            email=email
        )
    except Exception as e:
        return {"message": f"Frontend review failed: {e}"}, 500
    return jsonify(response), 200


# Feedback
@app.route('/api/feedback', methods=['POST'])
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
    is_ams = data.get('isAms')
    data_source = data.get('data_source')

    app.logger.info({"username": username, "user_email": user_email, "question_id": question_id, "feedback": feedback,
                     "require_email_update": require_email_update, "feedback_email": feedback_email, "liked": liked})

    data = app_service.get_feedback(username, email, user_email, question_id, liked, feedback, require_email_update,
                                    feedback_email, is_ams=is_ams, data_source=data_source)
    return data


# feature generation for any content
@app.route('/api/feature', methods=['POST'])
@require_token
@validate_input
def feature(username, email):
    # only user Paris can access this endpoint
    if username != "Paris":
        return {"message": "You are not authorized to access this endpoint."}, 403
    # verify the request data
    content = request.get_json()["content"]
    if content is None:
        return {"message": "Content is missing."}, 400
    if content == "":
        return {"message": "Content is empty."}, 400

    # get embeddings of the content
    try:
        embeddings = aiutils.compute_text_embedding(content)
    except Exception as e:
        return {"message": f"Feature generation failed: {e}"}, 500
    return {"embeddings": ",".join([str(num) for num in embeddings]), "message": "Feature generated successfully."}, 200


@app.route('/api/es/migration', methods=['POST'])
@require_token
@validate_input
def es_migration(username, email):
    """从MySQL完整迁移所有或者指定tenant的知识库到ES"""
    task_body = request.get_json()
    app.logger.info(task_body)

    try:
        tenants = task_body['tenants']
        batch_size = task_body.get('batch_size', 200)
        assert isinstance(tenants, list)
        result = app_service.migrate_es(tenants, batch_size)

    except Exception as e:
        app.logger.error(e)
        return jsonify({'message': str(e), 'status': 'FAILED'}), 500

    app.logger.info(result)
    response = {'message': result, 'status': 'SUCCESS'}
    return jsonify(response), 200


@app.route('/api/es/deleteIndex', methods=['DELETE'])
@require_token
@validate_input
def es_index_deletion(username, email):
    """从ES中删除指定tenant的知识库"""
    request_body = request.get_json()
    app.logger.info(request_body)

    try:
        tenant = request_body['tenant']
        result = app_service.delete_es_index(tenant)

    except Exception as e:
        app.logger.error(e)
        return jsonify({'message': str(e), 'status': 'FAILED'}), 500
    app.logger.info(result)
    response = {'message': result, 'status': 'SUCCESS'}
    return jsonify(response), 200


@app.route('/api/es/checkIndex', methods=['POST'])
@require_token
@validate_input
def es_index_check(username, email):
    """ES知识迁移进度查询（检查ES中的知识数量是否和MySQL中一致）"""
    request_body = request.get_json()
    app.logger.info(request_body)

    try:
        tenant = request_body['tenant']
        result = app_service.check_es_index(tenant)

    except Exception as e:
        app.logger.error(e)
        return jsonify({'message': str(e), 'status': 'FAILED'}), 500
    app.logger.info(result)
    response = {'message': result, 'status': 'SUCCESS'}
    return jsonify(response), 200


@app.after_request
def log_question_for_analysis(response):
    """
        Logs the question and answer for analysis.
        """
    # only log if the endpoint is the main endpoint
    if request.endpoint in ['index_v2', 'index_v2_stream']:
        app_service.log_question_for_analysis(DB_TABLES.get('QUESTION_PROCESSING_LOG'))

    if request.endpoint == 'ams.ams_index_v2':
        app_service.log_question_for_ams_analysis()

        # app.logger.info("the endpoint is not the main endpoint")
    return response


@app.errorhandler(Exception)
def error_handler(e):
    # handle error openai_timeout_error and infosec_check_failed
    if str(e) == "openai_timeout_error":
        app.logger.error("openai_timeout_error: " + traceback.format_exc())
        return {'message': 'server unavailable, please try later'}, 503

    if str(e) == "infosec_check_failed":
        app.logger.error("infosec_check_failed: " + traceback.format_exc())
        return {'message': 'Infosec check failed, please try later'}, 503

    if str(e) == "EMPTY_QUESTION":
        return {"message": "Dear, Please ask me a question."}, 503

    if str(e) == "QUESTION_TOO_LONG":
        return {"message": "Sorry, the question you asked might be too long. Please ask a shorter question.",
                "chat_id": g.chat_id}, 400

    if str(e) == "OPENAI_CONNECTION_ERROR":
        return {"message": "Sorry, service unavailable, please try later.", "chat_id": g.chat_id}, 503

    if str(e) == "NO_RELEVANT_KNOWLEDGE":
        return {"message": "Sorry, please help to specify your question to be relevant to Alipay+. "
                           "E.g. what is the integration process for auto debit?", "chat_id": g.chat_id}, 503

    if str(e) == "INFOSEC_CHECK_QUESTION_FAILED":
        return {"message": "Sorry, I could only answer questions related to Alipay+ integration.",
                "chat_id": g.chat_id}, 400

    if str(e) == "INFOSEC_CHECK_ANSWER_FAILED":
        return {"message": "Sorry, I could only answer questions related to Alipay+ integration.",
                "chat_id": g.chat_id}, 400

    if str(e) == "QUESTION_INSERTION_ERROR":
        return {"message": "Internal processing error, try later.", "chat_id": g.chat_id}, 500

    if str(e) == "INVALID_CHARACTERS":
        return {
            "message": "Sorry, the question you asked contains invalid characters, please ask in English or Chinese.",
            "chat_id": g.chat_id}, 400

    app.logger.error(f"global error: {e}" + traceback.format_exc())
    return {'message': 'internal system error'}, 500


@app.route("/api/playground", methods=["POST"])
@require_token
@validate_input
def playground(username, email):
    # only user Paris can access this endpoint
    if username != "Paris":
        return {"message": "You are not authorized to access this endpoint."}, 403
    # verify the request data
    prompt = request.get_json()["prompt"]
    if prompt is None:
        return {"message": "Prompt is missing."}, 400
    if prompt == "":
        return {"message": "Prompt is empty."}, 400

    question = request.get_json()["question"]

    if question is None:
        return {"message": "Question is missing."}, 400
    if question == "":
        return {"message": "Question is empty."}, 400

    # get embeddings of the content
    try:
        answer = aiutils.playground_question(prompt, question)
    except Exception as e:
        return {"message": f"Failed to get answer for playground: {e}"}, 500
    return {"answer": answer, "message": "Feature generated successfully."}, 200


@app.route("/api/getVersionList", methods=["POST"])
@require_token
@validate_input
def get_version_list(username, email):
    # verify the request data
    role = request.get_json()["role"]
    if role is None:
        return {"message": "Role is missing."}, 400
    if role == "":
        return {"message": "Role is empty."}, 400
    app.logger.info(f"Retrieve version list for role: {role}")
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        versions = pool.get_version_list_by_role(role)
        data = versions.to_dict(orient='records')
    except Exception as e:
        return {"message": f"Version List retrieval failed: {e}"}, 500
    return jsonify(data), 200


@app.route("/api/getSysParams", methods=["POST"])
@require_token
@validate_input
def get_sys_params(username, email):
    # verify the request data
    param_name = request.get_json()["param_name"]
    if param_name is None:
        return {"message": "param_name is missing."}, 400
    if param_name == "":
        return {"message": "param_name is empty."}, 400
    app.logger.info(f"Retrieve system parameters for param_name: {param_name}")
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        sys_params = pool.get_sys_params_by_name(param_name)
        data = list(sys_params)
    except Exception as e:
        return {"message": f"System parameters retrieval failed: {e}"}, 500
    return jsonify(data), 200


@app.route('/api/compareSimilarity', methods=['POST'])
@require_token
@validate_input
def compare_similarity(username, email):
    # verify the request data
    content1 = request.get_json()["content1"]
    content2 = request.get_json()["content2"]
    # get embeddings of the content
    try:
        embeddings1 = aiutils.compute_text_embedding(content1)
        embeddings2 = aiutils.compute_text_embedding(content2)
        # calculate cosine similarity
        similarity = aiutils.vector_similarity(embeddings1, embeddings2)
    except Exception as e:
        return {"message": f"Cannot get similarity score: {e}"}, 500
    return {"similarity": similarity}, 200


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)
