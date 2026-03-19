import sys

sys.path.append('.')
sys.path.append('..')

import unittest
from flask import Flask, request
from src.app_utils import *
from test.parameters import *

app = Flask(__name__)


class TestGenerateChatID(unittest.TestCase):

    def test_generate_new_chat_id(self):
        """
        when chat_id is empty, generate a new chat_id
        """
        mock_request_body = {
            'question': 'test',
            'chat_id': ''
        }
        with app.test_request_context(json=mock_request_body):
            chat_id = generate_chat_id(request)
            self.assertEqual(len(chat_id), 32)
            self.assertIsInstance(chat_id, str)

    def test_return_error_for_missing_keys(self):
        """
        when question or chat_id is missing, return error message
        """
        mock_request_body = {}
        with app.test_request_context(json=mock_request_body):
            response, status_code = generate_chat_id(request)
            self.assertEqual(status_code, 400)
            self.assertEqual(
                response, {"message": "question or chat_id not found."})

        mock_request_body = {
            'question': 'test'
        }
        with app.test_request_context(json=mock_request_body):
            response, status_code = generate_chat_id(request)
            self.assertEqual(status_code, 400)
            self.assertEqual(
                response, {"message": "question or chat_id not found."})

        mock_request_body = {
            'chat_id': 'test'
        }
        with app.test_request_context(json=mock_request_body):
            response, status_code = generate_chat_id(request)
            self.assertEqual(status_code, 400)
            self.assertEqual(
                response, {"message": "question or chat_id not found."})


class TestReplaceKeywords(unittest.TestCase):

    def test_replace_keywords_with_replacement_dict(self):
        """
        when keyword_replacement_dict is provided, replace keywords in the question
        """
        mock_request_body = {
            'question': 'What is A+?',
            'chat_id': '123'
        }
        with app.test_request_context(json=mock_request_body):
            keyword_replacement_dict = {
                'A+': 'Alipay+'
            }
            question_replaced = replace_keywords(
                request, 'test_user', keyword_replacement_dict)
            self.assertEqual(question_replaced, 'What is Alipay+?')

    def test_replace_keywords_without_replacement_dict(self):
        """
        when keyword_replacement_dict is not provided, return the original question
        """
        mock_request_body = {
            'question': 'What is A+?',
            'chat_id': '123'
        }
        with app.test_request_context(json=mock_request_body):
            question_replaced = replace_keywords(request, 'test_user', None)
            self.assertEqual(question_replaced, 'What is A+?')

    def test_reject_question_if_too_long(self):
        """
        when the question is too long, return error message
        """
        mock_request_body = {
            'question': 'a' * 1001,
            'chat_id': '123'
        }
        with app.test_request_context(json=mock_request_body):
            response, status_code = replace_keywords(
                request, 'test_user', None)
            self.assertEqual(status_code, 400)
            self.assertEqual(response, {
                "message": "Sorry, the question you asked might be too long. Please ask a shorter question.",
                "chat_id": "123"})

    def test_reject_question_with_invalid_characters(self):
        """
        when the question contains invalid characters, return error message
        """
        mock_request_body = {
            'question': 'おはようございます',
            'chat_id': '123'
        }
        with app.test_request_context(json=mock_request_body):
            with self.assertRaises(Exception) as context:
                replace_keywords(request, 'test_user', None)
            self.assertEqual(str(context.exception), 'INVALID_CHARACTERS')


class TestCheckQuestionLengthAndLanguage(unittest.TestCase):

    # def test_replace_synonyms_with_replacement_dict(self):
    #     """
    #     when synonym_list is provided, replace synonyms in the question
    #     """
    #     mock_request_body = {
    #         'question': 'What is MPP?',
    #         'chat_id': '123'
    #     }
    #     with app.test_request_context(json=mock_request_body):
    #         question_replaced = check_question_length_and_language(
    #             request, 'test_user')
    #         self.assertEqual(question_replaced, 'What is Mobile Payment Provider?')
    #
    # def test_replace_synonyms_without_replacement_dict(self):
    #     """
    #     when synonym_replacement_dict is not provided, return the original question
    #     """
    #     mock_request_body = {
    #         'question': 'What is MPP?',
    #         'chat_id': '123'
    #     }
    #     with app.test_request_context(json=mock_request_body):
    #         question_replaced = check_question_length_and_language(request, 'test_user')
    #         self.assertEqual(question_replaced, 'What is MPP?')

    def test_reject_question_if_empty(self):
        """
        when the question is too long, return error message
        """
        question = ''
        with app.app_context():
            with self.assertRaises(Exception) as context:
                check_question_length_and_language(question, 'test_user')
            self.assertEqual(str(context.exception), 'EMPTY_QUESTION')

    def test_reject_question_if_too_long(self):
        """
        when the question is too long, return error message
        """
        question = 'a' * 1001
        with app.app_context():
            # response, status_code = check_question_length_and_language(
            #     request, 'test_user')
            # self.assertEqual(status_code, 400)
            # self.assertEqual(response, {
            #     "message": "Sorry, the question you asked might be too long. Please ask a shorter question.",
            #     "chat_id": "123"})
            with self.assertRaises(Exception) as context:
                check_question_length_and_language(question, 'test_user')
            self.assertEqual(str(context.exception), 'QUESTION_TOO_LONG')

    def test_reject_question_with_invalid_characters(self):
        """
        when the question contains invalid characters, return error message
        """
        question = 'おはようございます'
        with app.app_context():
            with self.assertRaises(Exception) as context:
                check_question_length_and_language(question, 'test_user')
            self.assertEqual(str(context.exception), 'INVALID_CHARACTERS')


class TestCheckSensitiveInfo(unittest.TestCase):

    def test_check_sensitive_info_normal(self):
        """
        When the question is normal, return True
        """
        with app.app_context():
            result = check_sensitive_info(QUESTION_ORIGINAL, 'test_user', app)
        self.assertTrue(result)

    def test_check_sensitive_info_sensitive(self):
        """
        When the question is sensitive, return False
        """
        with app.app_context():
            result = check_sensitive_info(SENSITIVE_QUESTION, 'test_user', app)
        self.assertFalse(result)


class TestCheckQuestionByModeration(unittest.TestCase):

    def test_check_question_by_moderation_normal(self):
        """
        When the question is normal, return True
        """
        with app.app_context():
            result = check_question_by_moderation(
                QUESTION_ORIGINAL, 'test_user', app)
        self.assertTrue(result)

    def test_check_question_by_moderation_sensitive(self):
        """
        When the question is sensitive, return False
        """
        with app.app_context():
            result = check_question_by_moderation(
                SENSITIVE_QUESTION, 'test_user', app)
        self.assertFalse(result)

    def test_check_question_by_moderation_openai_connection_error(self):
        """
        When the connection of OpenAI fails, return False
        """
        with app.app_context():
            with self.assertRaises(Exception) as context:
                check_question_by_moderation(
                    QUESTION_ORIGINAL, 'test_user', app)
        self.assertEqual(str(context.exception), 'OPENAI_CONNECTION_ERROR')


class TestInfoSecCheck(unittest.TestCase):

    def test_info_sec_check_normal(self):
        """
        When the question is normal, return True
        """
        with app.app_context():
            result = info_sec_check(QUESTION_ORIGINAL, 'test_user', app)
        self.assertTrue(result)

    def test_info_sec_check_sensitive(self):
        """
        When the question is sensitive, return False
        """
        with app.app_context():
            result = info_sec_check(SENSITIVE_QUESTION, 'test_user', app)
        self.assertFalse(result)


class TestLlmDocRetrievalCheck(unittest.TestCase):
    def test_llm_doc_retrieval_check_chinese(self):
        """
        The result should be a bool
        """
        with app.app_context():
            result = llm_get_knowledge_check(
                answer="对不起，我没有找到和您的问题相关的内容，请换一个问题，或者提供更详细的细节。"
            )
        self.assertEqual(result, True)

    def test_llm_doc_retrieval_check_english(self):
        """
        The result should be a bool
        """
        with app.app_context():
            result = llm_get_knowledge_check(
                answer="I'm sorry, but I can't find the information you're asking for in the Alipay+ documents. " \
                       "Could you please provide more details or check another source?"
            )
        self.assertEqual(result, True)

    def test_llm_doc_retrieval_check_false(self):
        """
        The result should be a bool
        """
        with app.app_context():
            result = llm_get_knowledge_check(
                answer="Hello!"
            )
        self.assertEqual(result, False)


class TestSetAmsProduct(unittest.TestCase):

    def test_set_ams_product_empty(self):
        """
        When the request product is empty, return ["ALL"], []
        """
        mock_request_body = {
            'product': []
        }
        with app.test_request_context(json=mock_request_body):
            product, sub_product = set_ams_product(request)
        self.assertEqual(product, ["ALL"])
        self.assertEqual(sub_product, [])

    def test_set_ams_product_GOL(self):
        """
        When the request product is GOL, return ["GOL", "ALL"], sub_product
        """
        mock_request_body = {
            'product': ["Checkout Payment", "Scan To Bind"]
        }
        with app.test_request_context(json=mock_request_body):
            product, sub_product = set_ams_product(request)
        self.assertEqual(set(product), {"GOL", "ALL"})
        self.assertEqual(set(sub_product), {"Payment", "Authorization"})

    def test_set_ams_product_GOF(self):
        """
        When the request product is GOF, return ["GOF", "ALL"], sub_product
        """
        mock_request_body = {
            'product': ["User-Presented Mode Payment", "Entry Code Payment"]
        }
        with app.test_request_context(json=mock_request_body):
            product, sub_product = set_ams_product(request)
        self.assertEqual(product, ["GOF", "ALL"])
        self.assertEqual(set(sub_product), {
            "Payment", "Refund", "Registration"})

    def test_set_ams_product_GOL_and_GOF(self):
        """
        When the request product is GOL and GOF, return ["GOL", "GOF", "ALL"], sub_product
        """
        mock_request_body = {
            'product': ["Checkout Payment", "Order Code Payment"]
        }
        with app.test_request_context(json=mock_request_body):
            product, sub_product = set_ams_product(request)
        self.assertEqual(set(product), {"GOL", "GOF", "ALL"})
        self.assertEqual(set(sub_product), {
            "Payment", "Refund", "Registration"})

    def test_set_ams_request_empty(self):
        """
        When the request is empty, return ["ALL"], []
        """
        mock_request_body = {}
        with app.test_request_context(json=mock_request_body):
            product, sub_product = set_ams_product(request)
        self.assertEqual(product, ["ALL"])
        self.assertEqual(sub_product, [])


class TestSetRoleProductVersion(unittest.TestCase):

    def setUp(self):
        self.version_list = pool.get_latest_version()

    def test_set_role_product_version_empty_request(self):
        """
        When the request is empty, return "ACQP", ["ALL"], version_list.loc["ACQP"]["version"]
        """
        mock_request_body = {}
        with app.test_request_context(json=mock_request_body):
            role, product, version = set_role_product_version(
                request, app, self.version_list)
        self.assertEqual(role, "ACQP")
        self.assertEqual(product, ["ALL"])
        self.assertEqual(version, self.version_list.loc["ACQP"]["version"])

    def test_set_role_product_version_empty_role_product_version(self):
        """
        When role, product and version are empty, return "ACQP", ["ALL"], version_list.loc["ACQP"]["version"]
        """
        mock_request_body = {
            'role': "",
            'product': [],
            'version': ""
        }
        with app.test_request_context(json=mock_request_body):
            role, product, version = set_role_product_version(
                request, app, self.version_list)
        self.assertEqual(role, "ACQP")
        self.assertEqual(product, ["ALL"])
        self.assertEqual(version, self.version_list.loc["ACQP"]["version"])

    def test_set_role_product_version_mpm_in_product(self):
        """
        When 'MPM' in product
        """
        mock_request_body = {
            'role': "ACQP",
            'product': ["MPM"],
            'version': "1.0.0"
        }
        with app.test_request_context(json=mock_request_body):
            role, product, version = set_role_product_version(
                request, app, self.version_list)
        self.assertEqual(role, "ACQP")
        self.assertEqual(
            product, ["MPM", "ALL", "private_order_code", "order_code", "entry_code"])
        self.assertEqual(version, "1.0.0")


class TestVisitingUrlAndProductDetected(unittest.TestCase):

    def test_visiting_url_and_product_detected(self):
        """
        The result should be a list
        """
        mock_request_body = {
            'visiting_url': URL,
        }
        with app.test_request_context(json=mock_request_body):
            result = visiting_url_and_product_detected(
                request=request,
                app=app,
                question_original=QUESTION_ORIGINAL,
                product=PRODUCT,
                username=USERNAME,
                chat_id=CHAT_ID
            )
        self.assertIsInstance(result, list)


class TestGetSimilarQuestionClustering(unittest.TestCase):

    def test_get_similar_question_clustering(self):
        """
        When the sql query is valid, return a tuple with length of top_k
        """
        result = get_similar_question_clustering(SQL_QUERY, top_k=TOP_K)
        self.assertIsInstance(result, tuple)
        self.assertEqual(len(result), TOP_K)

    def test_get_similar_question_clustering_failed(self):
        """
        When the sql query is invalid, raise Exception
        """
        with self.assertRaises(Exception) as context:
            get_similar_question_clustering(
                'invalid_sql_query', top_k=TOP_K)
        self.assertIn('error when fetching similar questions: ', str(context.exception))


class TestFindRecordByChatId(unittest.TestCase):

    def test_find_record_by_chat_id_valid(self):
        """
        When the chat_id is valid and exists in the database, return the latest record
        """
        result = find_record_by_chat_id('64856966178723265346445023961039')
        self.assertIsInstance(result, tuple)

    def test_find_record_by_chat_id_invalid(self):
        """
        When the chat_id is invalid or does not exist in the database, return None
        """
        result = find_record_by_chat_id('456')
        self.assertIsNone(result)

    def test_find_record_by_chat_id_empty(self):
        """
        When the chat_id is empty, return None
        """
        result = find_record_by_chat_id('')
        self.assertIsNone(result)

    def test_find_record_by_chat_id_none(self):
        """
        When the chat_id is None, return None
        """
        result = find_record_by_chat_id(None)
        self.assertIsNone(result)


class TestFindAMSRecordByChatId(unittest.TestCase):

    def test_find_ams_record_by_chat_id_valid(self):
        """
        When the chat_id is valid and exists in the database, return the latest record
        """
        result = find_ams_record_by_chat_id('13755262166464422696603705200526')
        self.assertIsNotNone(result)

    def test_find_ams_record_by_chat_id_invalid(self):
        """
        When the chat_id is invalid or does not exist in the database, return None
        """
        result = find_ams_record_by_chat_id('456')
        self.assertIsNone(result)

    def test_find_ams_record_by_chat_id_empty(self):
        """
        When the chat_id is empty, return None
        """
        result = find_ams_record_by_chat_id('')
        self.assertIsNone(result)

    def test_find_ams_record_by_chat_id_none(self):
        """
        When the chat_id is None, return None
        """
        result = find_ams_record_by_chat_id(None)
        self.assertIsNone(result)


class TestFindRelevantKnowledge(unittest.TestCase):

    def test_find_relevant_knowledge(self):
        """
        The result should be a list
        """
        with app.app_context():
            result = find_relevant_knowledge(
                detected_products=DETECTED_PRODUCTS,
                question_original=QUESTION_ORIGINAL,
                filtered_document_embeddings=FILTERED_DOCUMENT_EMBEDDINGS
            )
        self.assertIsInstance(result, list)


if __name__ == '__main__':
    unittest.main()
