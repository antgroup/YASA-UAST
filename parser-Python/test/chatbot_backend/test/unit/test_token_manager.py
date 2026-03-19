import os
import unittest
from flask import Flask
from test.parameters import *
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
token_manager = TokenManager()


class TestGenerateToken(unittest.TestCase):

    def test_generate_token(self):
        """
        The result should be a string
        """
        with app.app_context():
            result = token_manager.generate_token(
                username=USERNAME,
                email=EMAIL
            )
        self.assertIsInstance(result, str)


class TestValidateToken(unittest.TestCase):

    def test_validate_token_with_valid_token(self):
        """
        This method tests the validate_token method with a valid token
        """
        with app.app_context():
            result = token_manager.validate_token(
                token=TOKEN_WITH_EMAIL
            )
        self.assertEqual(
            result,
            {'result_code': 'S', 'username': USERNAME, 'email': EMAIL}
        )

    def test_validate_token_with_invalid_token(self):
        """
        This method tests the validate_token method with an invalid token
        """
        with app.app_context():
            result = token_manager.validate_token(
                token=TOKEN_WITH_EMAIL[:-1]
            )
        self.assertEqual(result['result_code'], 'F')

    def test_validate_token_with_expired_token(self):
        """
        This method tests the validate_token method with an expired token
        """
        with app.app_context():
            result = token_manager.validate_token(
                token=TOKEN_EXPIRED
            )
        self.assertEqual(result['result_code'], 'F')


class TestGetFeedbackToken(unittest.TestCase):

    def test_get_feedback_token(self):
        """
        The result should be the feedback token
        """
        with app.app_context():
            result = token_manager.get_feedback_token()
        self.assertEqual(result,os.getenv("TOKEN_FOR_FEEDBACK"))
