import unittest

from flask import Response

from app import app
from test.parameters import *

class TestMiniProgram(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_mini_question(self):
        """
        This test method will test answering a question successfully
        """
        response = self.app.post(
            "/api/mini/v2/question",
            headers={
                'token': TOKEN_WITH_EMAIL
            },
            json={
                "question": "how can mini program get user location",
                "role": "MINI",  
                "product": ["ALL"],  
                "version": "1.4.2",
                "chat_id": "123456789",
            }
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json["answer"], str)
        self.assertIsInstance(response.json["chat_id"], str or int)
        self.assertIsInstance(response.json["further_reading"], list)
        self.assertIsInstance(response.json["question_id"], int)

    def test_ams_question_with_empty_question(self):
        """
        This test method will test answering an empty question
        """
        response = self.app.post(
            "/api/mini/v2/question",
            headers={
                'token': TOKEN_WITH_EMAIL
            },
            json={
                "question": "",
                "role": "MINI",  
                "product": ["ALL"],  
                "version": "1.4.2",
                "chat_id": 123456789,
            }

        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["answer"],
                         'Dear, Please ask me a question.')