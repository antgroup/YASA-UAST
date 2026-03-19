import unittest
import pandas as pd
from flask import Flask
from mysql.connector.pooling import PooledMySQLConnection

from test.parameters import *

app = Flask(__name__)


class TestGetConnection(unittest.TestCase):

    def test_get_connection(self):
        """
        The result should be a MySql Connection
        """
        with app.app_context():
            result = pool.get_connection()
        self.assertIsInstance(result, PooledMySQLConnection)


class TestLoadData(unittest.TestCase):

    def test_load_data(self):
        """
        The result should be a tuple contains a DataFrame and a dict
        """
        with app.app_context():
            result = pool.load_data(
                role=ROLE,
                version=VERSION,
                sub_product=SUB_PRODUCT,
            )
        self.assertIsInstance(result[0], pd.DataFrame)
        self.assertIsInstance(result[1], dict)


class TestLoadAMSData(unittest.TestCase):

    def test_load_ams_data(self):
        """
        The result should be a tuple contains a DataFrame and a dict
        """
        with app.app_context():
            result = pool.load_ams_data()
        self.assertIsInstance(result[0], pd.DataFrame)
        self.assertIsInstance(result[1], dict)


class TestLoadKeywordDictionary(unittest.TestCase):

    def test_load_keyword_dictionary(self):
        """
        The result should be a dict
        """
        with app.app_context():
            result = pool.load_keyword_dictionary()
        self.assertIsInstance(result, dict)


class TestLoadSynonyms(unittest.TestCase):

    def test_load_synonyms(self):
        """
        The result should be a list
        """
        with app.app_context():
            result = pool.load_synonyms()
        self.assertIsInstance(result, list)


class TestGetAllVersion(unittest.TestCase):

    def test_get_all_version(self):
        """
        The result should be a DataFrame
        """
        with app.app_context():
            result = pool.get_latest_version()
        self.assertIsInstance(result, pd.DataFrame)