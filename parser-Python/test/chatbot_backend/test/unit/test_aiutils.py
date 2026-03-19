import unittest
from flask import Flask
from src.aiutils import *
from test.parameters import *

app = Flask(__name__)


class TestNumTokensFromString(unittest.TestCase):

    def test_nums_tokens_from_string(self):
        """
        the result should be an int
        """
        with app.app_context():
            result = num_tokens_from_string('How are you')
        self.assertEqual(result, 3)


class TestComputeTextEmbedding(unittest.TestCase):

    def test_compute_text_embedding(self):
        """
        If connection succeeds, the result should be an embedding (list)
        """
        with app.app_context():
            result = compute_text_embedding('What is the capital of China?')
        self.assertIsInstance(result, list)

    def test_compute_text_embedding_connection_error(self):
        """
        If connection fails, raise 'openAI_timeout_error'
        """
        with self.assertRaises(Exception) as context:
            compute_text_embedding('What is the capital of China?')
        self.assertEqual(str(context.exception), 'OpenAI Timeout Error.')


class TestVectorSimilarity(unittest.TestCase):

    def test_vector_similarity(self):
        """
        The result should be a float
        """
        with app.app_context():
            result = vector_similarity(
                [1.2, 2.3, 3.4], [1.1, 2.2, 3.3, 4.4, 5.5])
        self.assertIsInstance(result, ndarray)


class TestGetStandardQuestions(unittest.TestCase):

    def test_get_standard_questions(self):
        """
        The result should be a list contains strings
        """
        with app.app_context():
            result = get_standard_questions()
        self.assertIsInstance(result, list)
        self.assertIsInstance(result[0], str)

    def test_get_standard_question_failed(self):
        """
        The result should be None
        """
        with app.app_context():
            result = get_standard_questions()
        self.assertIsNone(result)


class TestFilterEmbeddings(unittest.TestCase):

    def test_filter_embeddings(self):
        """
        The result should be a tuple contains a dataframe and a dict
        """
        with app.app_context():
            result = filter_embeddings(
                sub_product=SUB_PRODUCT,
                version=VERSION,
                role=ROLE
            )
        self.assertIsInstance(result, tuple)
        self.assertIsInstance(result[0], pd.DataFrame)
        self.assertIsInstance(result[1], dict)
        self.assertIsInstance(result[2], dict)


class TestOrderDocumentSectionsByQuerySimilarity(unittest.TestCase):

    def test_order_document_sections_by_query_similarity(self):
        """
        The result should be a list
        """
        with app.app_context():
            result = order_document_sections_by_query_similarity(
                query=QUESTION,
                knowledge=KNOWLEDGE
            )
        self.assertIsInstance(result, list)


class TestConstructPrompt(unittest.TestCase):

    def test_construct_prompt(self):
        """
        The result should be a string and a list
        """
        with app.app_context():
            result = construct_prompt(
                product_line=ALIPAY_PLUS_PRODUCT_LINE,
                question_original=QUESTION_ORIGINAL,
                relevant_knowledge=RELEVANT_KNOWLEDGE,
                df_t=DF,
                diff=0.3
            )
        self.assertIsInstance(result[0], str)
        self.assertIsInstance(result[1], list)


class TestGetTheAnswer(unittest.TestCase):

    def test_get_the_answer(self):
        """
        The result should be a string
        """
        with app.app_context():
            answer = get_the_answer(
                messages='What is the capital of China?',
            )
        self.assertIsInstance(answer, str)

    def test_get_the_answer_failed(self):
        with self.assertRaises(Exception) as context:
            get_the_answer(
                messages='What is the capital of China?',
            )
        self.assertEqual(str(context.exception), "openai_timeout_error")


class TestTypeDetect(unittest.TestCase):

    def test_type_detect(self):
        """
        This result should be a string
        """
        with app.app_context():
            result = type_detect(query=QUESTION)
        self.assertIsInstance(result, list)


class TestProductDetectFromVisiting(unittest.TestCase):

    def test_product_detect_from_visiting(self):
        """
        This result should be equal to 'cashier_payment'
        """
        with app.app_context():
            result = product_detect_from_visiting(URL)
        self.assertEqual(result, 'cashier_payment')

    def test_product_detect_from_visiting_with_unknown_keyword(self):
        """
        This result should be equal to 'ALL'
        """
        with app.app_context():
            result = product_detect_from_visiting(URL_UNKNOWN)
        self.assertEqual(result, 'ALL')


class TestScenarioDetect(unittest.TestCase):

    def test_scenario_detect(self):
        """
        The result should be a list
        """
        with app.app_context():
            result = scenario_detect(query=QUESTION)
        self.assertIsInstance(result, list)


class TestSimilarityWithPreviousQuestion(unittest.TestCase):

    def test_similarity_with_previous_question(self):
        """
        The result should be a float
        """
        with app.app_context():
            result = similarity_with_previous_question(
                question=QUESTION_ORIGINAL,
                product=PRODUCT,
                previous_question=PREVIOUS_QUESTION,
                previous_answer=PREVIOUS_ANSWER,
                previous_products_belongs_to=PREVIOUS_PRODUCTS_BELONGS_TO,
                role=ROLE,
                previous_role=PREVIOUS_ROLE
            )
        self.assertIsInstance(result, float)


class TestAMSSimilarityWithPreviousQuestion(unittest.TestCase):

    def test_ams_similarity_with_previous_question(self):
        """
        The result should be a float
        """
        with app.app_context():
            result = ams_similarity_with_previous_question(
                question=QUESTION_ORIGINAL,
                product=PRODUCT,
                previous_question=PREVIOUS_QUESTION,
                previous_answer=PREVIOUS_ANSWER,
                previous_products_belongs_to=PREVIOUS_PRODUCTS_BELONGS_TO,
            )
        self.assertIsInstance(result, float)


class TestHandleQuestion(unittest.TestCase):
    def test_handle_similar_question(self):
        """
        The result should be a tuple contains two strings
        """
        with app.app_context():
            result = handle_question(
                question=QUESTION,
                prompt=PROMPT,
                histories=HISTORIES,
            )
        self.assertIsInstance(result[0], str)
        self.assertIsInstance(result[1], str)


class TestGetTheAnswerRelevantContentList(unittest.TestCase):

    def test_get_the_answer_relevant_content_list(self):
        """
        The result should be a list
        """
        with app.app_context():
            result = get_the_answer_relevant_content_list(
                answer=ANSWER,
                select_sections_index=SELECT_SECTIONS_INDEX,
                document_embeddings_t=FILTERED_DOCUMENT_EMBEDDINGS
            )
        self.assertIsInstance(result, list)


class TestGetAnswerRelevantKnowledges(unittest.TestCase):

    def test_get_answer_relevant_knowledges(self):
        """
        The result should be a list
        """
        with app.app_context():
            result = get_answer_relevant_knowledge(
                relevant_list=RELEVANT_LIST,
                df_t=DF
            )
        self.assertIsInstance(result, list)


class TestCutText(unittest.TestCase):

    def test_cut_text(self):
        """
        The result should be a string contains tokens less equal to max_tokens
        """
        with app.app_context():
            result = cut_text(
                text=QUESTION,
                max_tokens=2
            )
        self.assertEqual(result, 'What is')


class TestIsChinese(unittest.TestCase):
    def test_is_chinese(self):
        """
        If the input contains Chinese characters, the result should be True
        """
        with app.app_context():
            result = is_chinese('你好')
        self.assertEqual(result, True)

    def test_is_chinese_false(self):
        """
        If the input doesn't contain any Chinese characters,
        the result should be False
        """
        with app.app_context():
            result = is_chinese('Hello!')
        self.assertEqual(result, False)


class TestCutWords(unittest.TestCase):
    def test_cut_words(self):
        """
        The result should be a list contains strings
        """
        with app.app_context():
            result = cut_words(QUESTION)
        self.assertEqual(result, list)


class TestPlaygroundQuestion(unittest.TestCase):

    def test_playground_question(self):
        """
        The result should be a string
        """
        with app.app_context():
            result = playground_question(
                prompt=PROMPT,
                question=QUESTION
            )
        self.assertIsInstance(result, str)


class TestAMSFilterEmbeddings(unittest.TestCase):

    def test_ams_filter_embeddings(self):
        """
        The result should be a dict
        """
        with app.app_context():
            result = ams_filter_embeddings(
                embeddings=EMBEDDINGS,
                product=PRODUCT,
                sub_product=SUB_PRODUCT,
            )
        self.assertIsInstance(result, dict)


class TestGetQueryForDocRetrieval(unittest.TestCase):
    def test_get_query_for_doc_retrieval(self):
        """
        The result should be a string
        """
        with app.app_context():
            result = get_query_for_doc_retrieval(
                question_original=QUESTION_ORIGINAL,
                histories=HISTORIES,
                use_llm_summary=False
            )
        self.assertEqual(result, str)

    def test_get_query_for_doc_retrieval_with_llm_summary(self):
        """
        The result should be a string
        """
        with app.app_context():
            result = get_query_for_doc_retrieval(
                question_original=QUESTION_ORIGINAL,
                histories=HISTORIES,
                use_llm_summary=True
            )
        self.assertEqual(result, str)


if __name__ == '__main__':
    unittest.main()
