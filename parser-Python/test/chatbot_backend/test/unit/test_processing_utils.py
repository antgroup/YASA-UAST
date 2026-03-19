import unittest
from src.preprocessing_utils import replace_keyword, replace_synonym, detect_synonym
from flask import Flask

app = Flask(__name__)


class TestReplaceKeyword(unittest.TestCase):
    def test_replace_keyword(self):
        text = """
        What is the best way to go from one place to another? Right a function with ```def``` keyword. How many wallets are there?
        What are wallets? One two three.
        """
        replacement_dict = {
            "hello": "hi, Hi, Hello",
            "to": "2",
            "two": "2, 二, 两",
            "wallets": "Mobile Payment Providers, MPPs"
        }

        with app.app_context():
            result = replace_keyword(text=text,
                                     replacement_dict=replacement_dict)
        self.assertEqual(
            result,
            'What is the best way to (also called 2) go from one place to (also called 2) another? Right a function with ```def``` keyword. How many wallets (also called Mobile Payment Providers, MPPs) are there? What are wallets (also called Mobile Payment Providers, MPPs)? One two (also called 2, 二, 两) three.')


class TestReplaceSynonym(unittest.TestCase):
    def test_replace_synonym(self):
        text = """
         What is the best way to go from one place to another? Right a function with ```def``` keyword. How many wallets are there?
         What are wallets? One two three.
        """
        synonyms = [
            ['hello', 'hi', 'Hi', 'Hello'],
            ['to', '2'],
            ['two', '2', '二', '两'],
            ['wallets', 'Mobile Payment Providers', 'MPPs']
        ]

        with app.app_context():
            result = replace_synonym(text=text, synonyms=synonyms)
        self.assertEqual(
            result,
            'What is the best way to (also called 2) go from one place to (also called 2) another? Right a function with ```def``` keyword. How many wallets (also called Mobile Payment Providers, MPPs) are there? What are wallets (also called Mobile Payment Providers, MPPs)? One two (also called 2, 二, 两) three.')


class TestDetectSynonym(unittest.TestCase):
    def test_detect_synonym(self):
        text = """
         How many wallets are there?
        """
        synonyms = [
            ['hello', 'hi', 'Hi', 'Hello'],
            ['to', '2'],
            ['two', '2', '二', '两'],
            ['wallets', 'Mobile Payment Providers', 'MPPs']
        ]

        with app.app_context():
            result = detect_synonym(text=text, synonyms=synonyms)
        self.assertEqual(result, ['wallets', 'Mobile Payment Providers', 'MPPs'])
