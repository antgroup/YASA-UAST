# coding: utf-8
import os

from dotenv import load_dotenv
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

from src import app_service
from src.TokenManager import require_token
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
ALIPAY_PLUS_PRODUCT_LINE = os.getenv('ALIPAY_PLUS_PRODUCT_LINE')
AMS_PRODUCT_LINE = os.getenv('AMS_PRODUCT_LINE')
MINI_PROGRAM_PRODUCT_LINE = os.getenv('MINI_PROGRAM_PRODUCT_LINE')
INTERNAL_EMAIL_SUFFIX = eval(os.getenv('INTERNAL_EMAIL_SUFFIX'))

bp = Blueprint('dashboard', __name__, url_prefix='/')


@bp.route("/api/manage/dashboard/getUserData", methods=["POST"])
@require_token
@validate_input
def get_userdata(username, email):
    time_period = request.json.get('time_period')
    if not time_period:
        return {"message": "Time Period is missing or empty."}, 400

    role = request.json.get('role')
    if role is None:
        return {"message": "Role is missing."}, 400
    elif role == '':
        return {"message": "Role is empty."}, 400

    version = request.json.get('version')
    if version is None:
        return {"message": "Version is missing."}, 400
    elif version == '':
        return {"message": "Version is empty."}, 400

    product_line = request.json.get('product_line')
    if not product_line:
        product_line = 'Alipay+'
    if product_line not in ['Alipay+', 'PDS', 'MINI', 'Remittance']:
        message = f"The product line {product_line} is not supported yet, please choose one from 'Alipay+, PDS, MINI or Remittance.'"
        return {"message": message}, 500

    data = app_service.get_userdata(time_period, role, version, product_line)
    if data is None:
        return {"message": "Failed to get userdata"}, 500
    return jsonify(data), 200


@bp.route("/api/manage/dashboard/getRobotPerformance", methods=["POST"])
@require_token
@validate_input
def get_robot_performance(username, email):
    time_period = request.json.get('time_period')
    if not time_period:
        return {"message": "Time Period is missing or empty."}, 400

    role = request.json.get('role')
    if role is None:
        return {"message": "Role is missing."}, 400
    elif role == '':
        return {"message": "Role is empty."}, 400

    version = request.json.get('version')
    if version is None:
        return {"message": "Version is missing."}, 400
    elif version == '':
        return {"message": "Version is empty."}, 400

    product_line = request.json.get('product_line')
    if not product_line:
        product_line = 'Alipay+'
    if product_line not in ['Alipay+', 'PDS', 'MINI', 'Remittance']:
        message = f"The product line {product_line} is not supported yet, please choose one from 'Alipay+, PDS, MINI or Remittance.'"
        return {"message": message}, 500

    data = app_service.get_robot_performance(time_period, role, version, product_line)
    if data is None:
        return {"message": "Failed to get robot performance"}, 500
    return jsonify(data), 200


@bp.route("/api/manage/dashboard/getTrendAnalysis", methods=["POST"])
@require_token
@validate_input
def get_trend_analysis(username, email):
    indicator = request.json.get('indicator')
    if indicator is None:
        return {"message": "Indicator is missing."}, 400
    elif indicator == '':
        return {"message": "Indicator is empty."}, 400

    time_unit = request.json.get('time_unit')
    if time_unit is None:
        return {"message": "Time Unit is missing."}, 400
    elif time_unit == '':
        return {"message": "Time Unit is empty."}, 400

    time_period = request.json.get('time_period')
    if not time_period:
        return {"message": "Time Period is missing or empty."}, 400

    role = request.json.get('role')
    if role is None:
        return {"message": "Role is missing."}, 400
    elif role == '':
        return {"message": "Role is empty."}, 400

    version = request.json.get('version')
    if version is None:
        return {"message": "Version is missing."}, 400
    elif version == '':
        return {"message": "Version is empty."}, 400

    product_line = request.json.get('product_line')
    if not product_line:
        product_line = 'Alipay+'
    if product_line not in ['Alipay+', 'PDS', 'MINI', 'Remittance']:
        message = f"The product line {product_line} is not supported yet, please choose one from 'Alipay+, PDS, MINI or Remittance.'"
        return {"message": message}, 500

    data = app_service.get_trend_analysis(indicator, time_unit, time_period, role, version, product_line)
    if data is None:
        return {"message": "Failed to get trend analysis"}, 500
    return jsonify(data), 200


@bp.route("/api/manage/dashboard/getKeywords", methods=["POST"])
@require_token
@validate_input
def get_keywords(username, email):
    top_k = request.json.get('top_k')

    time_period = request.json.get('time_period')
    if not time_period:
        return {"message": "Time Period is missing or empty."}, 400

    role = request.json.get('role')
    if role is None:
        return {"message": "Role is missing."}, 400
    elif role == '':
        return {"message": "Role is empty."}, 400

    version = request.json.get('version')
    if version is None:
        return {"message": "Version is missing."}, 400
    elif version == '':
        return {"message": "Version is empty."}, 400

    keyword = request.json.get('keyword')
    if keyword is None:
        return {"message": "Keyword is missing."}, 400
    elif keyword == '':
        return {"message": "Keyword is empty."}, 400

    product_line = request.json.get('product_line')
    if not product_line:
        product_line = 'Alipay+'
    if product_line not in ['Alipay+', 'PDS', 'MINI', 'Remittance']:
        message = f"The product line {product_line} is not supported yet, please choose one from 'Alipay+, PDS, MINI or Remittance.'"
        return {"message": message}, 500

    data = app_service.get_keywords(top_k, time_period, role, version, keyword, product_line)
    if data is None:
        return {"message": "Failed to get keywords"}, 500
    return jsonify(data), 200


@bp.route("/api/manage/dashboard/getQuestions", methods=["POST"])
@require_token
@validate_input
def get_questions(username, email):
    top_k = request.json.get('top_k')

    time_period = request.json.get('time_period')
    if not time_period:
        return {"message": "Time Period is missing or empty."}, 400

    role = request.json.get('role')
    if role is None:
        return {"message": "Role is missing."}, 400
    elif role == '':
        return {"message": "Role is empty."}, 400

    version = request.json.get('version')
    if version is None:
        return {"message": "Version is missing."}, 400
    elif version == '':
        return {"message": "Version is empty."}, 400

    product_line = request.json.get('product_line')
    if not product_line:
        product_line = 'Alipay+'
    if product_line not in ['Alipay+', 'PDS', 'MINI', 'Remittance']:
        message = f"The product line {product_line} is not supported yet, please choose one from 'Alipay+, PDS, MINI or Remittance.'"
        return {"message": message}, 500

    data = app_service.get_questions(top_k, time_period, role, version, product_line)
    if data is None:
        message = f"Failed to get questions"
        app.logger.error(message)
        return {"message": message}, 500
    return jsonify(data), 200
