# coding: utf-8
import os
import time

import mysql.connector
import pandas as pd
from dotenv import load_dotenv
from elasticsearch import Elasticsearch
from sqlalchemy import create_engine
from flask import current_app as app

load_dotenv()


class InitDB:
    def __init__(self):
        # 创建数据库连接池
        db_config = {
            "host": os.getenv('MYSQL_HOST'),
            "user": os.getenv('MYSQL_USER'),
            "password": os.getenv('MYSQL_PASSWORD'),
            "database": "chatbot",
            "charset": "utf8mb4"
        }
        self.pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="mypool",
            pool_reset_session=True,
            pool_size=30,
            **db_config
        )
        self.db_engine = create_engine(
            "mysql+pymysql://{user}:{password}@{host}/{database}".format(**db_config)
        )

        self.es_client = Elasticsearch(
            os.getenv('ES_HOST'),
            http_auth=(os.getenv('ES_USER'), os.getenv('ES_PASSWORD')),
            timeout=30
        )

    def get_connection(self):
        return self.pool.get_connection()

    def get_used_connection_count(self):
        """
        获取当前已使用的数据库连接数
        """
        used_connections = self.pool.pool_size - self.pool._cnx_queue.qsize()
        return used_connections

    def load_data(self, role: str, version: str, sub_product: list[str], db_table='knowledge_base'):
        start_time = time.time()
        conn = None
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            conn = self.pool.get_connection()
            format_subproduct = ""
            for i in sub_product:
                format_subproduct += "'" + i + "',"
            format_subproduct = format_subproduct[:-1]

            # If `sub_product` is not specified, then there's no need to query it
            if len(sub_product) == 1 and sub_product[0] == 'ALL':
                sub_product_query = ''
            else:
                sub_product_query = f'AND sub_product IN ({format_subproduct})'

            query = f"SELECT id, title, heading, category, product, sub_product, role, content, url, features, version FROM {db_table} WHERE role = %s AND version = %s {sub_product_query}"

            df_list = []
            for chunk in pd.read_sql_query(
                    sql=query,
                    con=conn,
                    params=(role, version),
                    index_col="id", chunksize=1000):
                df_list.append(chunk)
            df = pd.concat(df_list)

            time_taken = time.time() - start_time
            print(f"Time taken to DB to get knowledge: {time_taken}")

            start_time2 = time.time()
            document_embeddings = {}
            document_contents = {}
            for item in df.iterrows():
                key = item[0], item[1]["version"], item[1]["role"], item[1]["sub_product"]
                document_embeddings[key] = [float(li) for li in item[1]['features'].split(",")]
                document_contents[key] = item[1]['content']
            print(f"Time taken to traverse embeddings: {time.time() - start_time2}")
        finally:
            if conn:
                conn.close()  # 确保连接在使用后被关闭
        return df, document_embeddings, document_contents

    # 加载AMS数据库
    def load_ams_data(self):
        df = pd.read_sql(
            "select id,title,heading,category,product,sub_product, url,features,content,md5 from ams_knowledge_base_v3",
            self.db_engine)
        df = df.set_index(["id"])

        document_embeddings = {}
        for item in df.iterrows():
            document_embeddings[(item[0], item[1]["title"], item[1]["product"], item[1]["sub_product"])] \
                = [float(li) for li in item[1]['features'].split(",")]

        return df, document_embeddings

    def load_keyword_dictionary(self) -> dict:
        """
        This function loads the keyword dictionary from the database.
        """
        conn = None
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            conn = self.pool.get_connection()
            df = pd.read_sql("select keyword, replacement from keyword_dictionary", conn)
        except Exception as e:
            print(f"Error occurred while loading keyword dictionary: {e}")
        finally:
            if conn:
                conn.close()  # 确保连接在使用后被关闭
        keyword_replacement_dict = {}
        for item in df.iterrows():
            keyword_replacement_dict[item[1]["keyword"]] = item[1]["replacement"]

        return keyword_replacement_dict

    def load_synonyms(self, product_line='Alipay+') -> tuple[list[str], list[list]]:
        """
        This function loads the standard terms and their synonyms from the database.
        """
        table_mapping = {
            os.getenv('ALIPAY_PLUS_PRODUCT_LINE'): 'synonyms',
            os.getenv('AMS_PRODUCT_LINE'): 'synonyms',
            os.getenv('MINI_PROGRAM_PRODUCT_LINE'): 'mini_synonyms',
            os.getenv('PDS_PRODUCT_LINE'): 'pds_synonyms',
            os.getenv('REMITTANCE_PRODUCT_LINE'): 'remittance_synonyms'
        }
        standards, synonyms = [], []
        try:
            df: pd.DataFrame = pd.read_sql(f"select standard, synonym from {table_mapping[product_line]}",
                                           self.db_engine)
        except Exception as e:
            print(e)
            df = pd.read_sql(f"select synonym from {table_mapping[product_line]}", self.db_engine)
            for item in df.synonym:
                synonym_list = item.split(',')
                synonyms.append(synonym_list)
        else:
            for standard, synonym in df.values:
                synonym_list = synonym.split(',')
                synonyms.append(synonym_list)
                standards.append(standard)

        return standards, synonyms

    # get latest version
    def get_latest_version(self, db_table: str = 'knowledge_base') -> pd.DataFrame:
        df = pd.read_sql(
            sql=f"select max(version) as version, role from {db_table} group by role",
            con=self.db_engine
        )
        df = df.set_index(["role"])
        return df

    def get_version_list_by_role(self, role_value: str, db_table: str = 'knowledge_base'):
        df = pd.read_sql(
            sql=f"select distinct version as label, version as value from {db_table} where role = %s group by version order by version",
            params=(role_value,),
            con=self.db_engine
        )
        return df

    def get_sys_params_by_name(self, param_name: str, db_table: str = 'sys_paramter'):
        df = pd.read_sql(
            sql=f'select param_value from {db_table} where param_name = %s and end_datetime > now()',
            params=(param_name,),
            con=self.db_engine
        )
        return df['param_value']

    def get_api_sdk_doc_title_list(self, role: str, version: str, db_table: str = 'knowledge_base'):
        api_df = pd.read_sql(
            sql=f"select title from {db_table} where role = %s and version = %s and title like '%%Home/Integration/API Reference/%%'",
            params=(role, version),
            con=self.db_engine
        )
        sdk_df = pd.read_sql(
            sql=f"select title from {db_table} where role = %s and version = %s and title like '%%Home/Integration/SDK Reference/%%'",
            params=(role, version),
            con=self.db_engine
        )
        titles = list(set([title.split(' | ')[0].split('@')[1].split('/')[0]
                           for title in list(api_df['title']) + list(sdk_df['title'])]))
        return titles


pool = InitDB()
