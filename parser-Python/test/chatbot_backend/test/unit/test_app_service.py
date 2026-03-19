import unittest
from flask import Flask

from src.app_service import *
from test.parameters import *

app = Flask(__name__)


class TestDealWithChat(unittest.TestCase):
    def test_deal_with_chat(self):
        """
        This method will test the function `test_deal_with_chat`
        """
        with app.app_context():
            result = deal_with_chat(
                product_line='',
                db_tables='',
                chat_id=CHAT_ID,
                detected_products=DETECTED_PRODUCTS,
                question_original=QUESTION_ORIGINAL,
                filtered_document_embeddings=FILTERED_DOCUMENT_EMBEDDINGS,
                username=USERNAME,
                df=DF)
        self.assertIsInstance(result[0], str)
        self.assertIsInstance(result[1], list)
        self.assertIsInstance(result[2], str)

    def test_deal_with_chat_no_relevant_knowledge(self):
        with self.assertRaises(Exception) as context:
            deal_with_chat(
                product_line=ALIPAY_PLUS_PRODUCT_LINE,
                db_tables=TABLE_NAME,
                chat_id=CHAT_ID,
                detected_products=DETECTED_PRODUCTS,
                question_original=IRRELEVANT_QUESTION,
                filtered_document_embeddings=FILTERED_DOCUMENT_EMBEDDINGS,
                username=USERNAME,
                df=DF)
        self.assertEqual(str(context.exception), "NO_RELEVANT_KNOWLEDGE")

    def test_deal_with_chat_infosec_failed(self):
        with self.assertRaises(Exception) as context:
            deal_with_chat(
                product_line=ALIPAY_PLUS_PRODUCT_LINE,
                db_tables=TABLE_NAME,
                chat_id=CHAT_ID,
                detected_products=DETECTED_PRODUCTS,
                question_original=SENSITIVE_QUESTION,
                filtered_document_embeddings=FILTERED_DOCUMENT_EMBEDDINGS,
                username=USERNAME,
                df=DF)
        self.assertEqual(str(context.exception), "INFOSEC_CHECK_ANSWER_FAILED")


class TestStoreQuestionAndAnswer(unittest.TestCase):

    def test_store_question_and_answer(self):
        """
        This method will test the function `test_store_question_and_answer`
        """
        with app.app_context():
            result = store_question_and_answer(
                username=USERNAME,
                email=EMAIL,
                question=QUESTION,
                answer=ANSWER,
                prompt=PROMPT,
                chat_id=CHAT_ID,
                role=ROLE,
                product=PRODUCT,
                version=VERSION,
                response_time=RESPONSE_TIME
            )
        self.assertIsInstance(result, int or None)


class TestAMSStoreQuestionAndAnswer(unittest.TestCase):

    def test_ams_store_question_and_answer(self):
        """
        This method will test the function `test_ams_store_question_and_answer`
        """
        with app.app_context():
            result = ams_store_question_and_answer(
                username=USERNAME,
                email=EMAIL,
                question=QUESTION,
                answer=ANSWER,
                further_reading='',
                prompt=PROMPT,
                chat_id=CHAT_ID,
                product=PRODUCT,
                submit_type=''
            )
        self.assertIsInstance(result, int or None)


class TestLogQuestionForAnalysis(unittest.TestCase):

    def test_log_question_for_analysis(self):
        """
        The method `log_question_for_analysis` doesn't return anything
        """
        with app.app_context():
            result = log_question_for_analysis()
        self.assertIsNone(result)


class TestLogQuestionForAMSAnalysis(unittest.TestCase):

    def test_log_question_for_ams_analysis(self):
        """
        The method `log_question_for_ams_analysis` doesn't return anything
        """
        with app.app_context():
            result = log_question_for_ams_analysis()
        self.assertIsNone(result)

