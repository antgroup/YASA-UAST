# coding: utf-8
import inspect
import json
import os
import time
from pathlib import Path
from typing import Union, Callable

import jieba
import nltk
import numpy as np
import pandas as pd
import tiktoken
from dotenv import load_dotenv
from flask import current_app as app
from langchain_core.utils.function_calling import convert_to_openai_tool
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from numpy import ndarray
from openai import OpenAI

load_dotenv()
from src import app_utils
from src.db_pool import pool
from src.preprocessing_utils import detect_synonym

LLM = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
QUERY_EMBEDDINGS_MODEL = "text-embedding-ada-002"
COMPLETIONS_MODEL = os.getenv('COMPLETIONS_MODEL')
ES_MODE = os.getenv('ES_MODE')

MAX_SECTION_LEN = 10000
SEPARATOR = "\nItem "
MAX_RELEVANT_KNOWLEDGE = 5
MAX_EMBEDDINGS_MODEL_TOKEN = 4000

nltk.download('punkt')


# get the tokens of an input string
def num_tokens_from_string(string: str, model_name: str = COMPLETIONS_MODEL) -> int:
    """
    Calculate the number of tokens in the string

    Args:
        string (str): 待统计的字符串
        model_name (str, optional): 模型名称. Defaults to 'gpt-3.5-turbo'.

    Returns:
        int: token数量
    """
    encoding = tiktoken.encoding_for_model(model_name)
    num_tokens = len(encoding.encode(string))

    return num_tokens


# compute text embedding with 3 times trying to avoid the openAI connection error
def compute_text_embedding(text: str, model=QUERY_EMBEDDINGS_MODEL, count=1) -> list[float]:
    """
        compute the text embedding using openai api
    """
    try:
        # check if the text token reach the max, cut the text)
        if num_tokens_from_string(text) > MAX_EMBEDDINGS_MODEL_TOKEN:
            text = cut_text(text, MAX_EMBEDDINGS_MODEL_TOKEN)
        # result = openai.Embedding.create(
        result = LLM.embeddings.create(
            model=model,
            input=text
        )
    except Exception as e:
        if count < 3:
            time.sleep(0.5)
            return compute_text_embedding(text, model, count + 1)
        else:
            raise Exception("OpenAI Timeout Error.")
    # return result["data"][0]["embedding"]
    return result.data[0].embedding


# compare the similarity between two vectors
def vector_similarity(x: list[float], y: list[float]) -> ndarray:
    """
        calc cosine similarity between two vectors
    """
    return np.dot(np.array(x), np.array(y))


def get_standard_questions() -> list[str] | None:
    """
    Get all the standard questions from table `automate_test_question_list`
    """
    app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
    try:
        con = pool.get_connection()
        cur = con.cursor()

        query = 'select question from `automate_test_question_list`'
        cur.execute(query)
        records = cur.fetchall()
    except Exception as e:
        app.logger.error(
            f"An error occurred when querying standard questions from the table `automate_test_question_list`: {e}")
        return None
    finally:
        con.close()

    return [record[0] for record in records]


# filter the embedding by the product
def filter_embeddings(sub_product: list[str], version: str, role: str, db_table='knowledge_base') -> tuple[
    pd.DataFrame, dict[str, list[float]]]:
    """
    return features items when the sub_prod matches
    """
    df, embeddings, contents = pool.load_data(role, version, sub_product, db_table)
    embeddings_t = {feature_id: embeddings[(feature_id, version, role, sub_prod)] for feature_id, _, _, sub_prod in
                    embeddings}
    
    return df, embeddings_t


def handle_stream_answer(question, prompts, tools, histories, model=COMPLETIONS_MODEL, **kwargs):
    """
    处理流式响应

    Args:
        question(str): user question
        prompts(list): prompt constructed
        tools(list[Callable]): the tools for LLM to call
        histories(list[tuple[str]]): chat history fetched from the database
        model(str): model name

    Returns:
        Prompt and answer
    """
    integration_status = kwargs.get('integration_status')
    if integration_status:
        question = f"""Integration status: {integration_status}, User question: ------------{question}------------"""
    else:
        question = f"""User question: ------------{question}------------"""
    for history in histories:
        prompts.append({"role": "user", "content": f"User question: ------------{history[0]}------------"})
        prompts.append({"role": "assistant", "content": history[1]})
    prompts.append({"role": "user", "content": question})

    if tools:
        response = get_the_stream_answer_with_tools(prompts, tools, model=model)
    else:
        response = get_the_stream_answer(prompts, model=model)

    return response


def ams_handle_stream_answer(question, prompt, histories):
    """
    处理流式响应
    """
    question = f"""User question: ``````{question}``````"""

    messages = [
        {"role": "system", "content": prompt}
    ]

    for history in histories:
        messages.append({"role": "user", "content": history[0]})
        messages.append({"role": "assistant", "content": history[1]})
    messages.append({"role": "user", "content": question})

    answer = get_the_stream_answer(messages)
    return answer


# get the answer from the model
def get_the_answer(messages,
                   model=COMPLETIONS_MODEL,
                   count=1,
                   temperature=0.1) -> str:
    """
    call the language model and get the answer
    """

    # retry 3 times if timeout
    try:
        response = LLM.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,  #
            top_p=0.1,  # only consider the top 10% probability to choose the next token
        )
    except Exception as e:
        if count > 3:
            raise Exception(f"openai_timeout_error {e}")
        count += 1
        time.sleep(1)
        return get_the_answer(messages, count=count)

    answer = response.choices[0].message.content
    # when the answer contains "provided/given text", replace it with "A+ document"
    answer = answer.replace("provided text", "A+ document")
    answer = answer.replace("provided context", "A+ document")
    answer = answer.replace("given text", "A+ document")
    answer = answer.replace("given context", "A+ document")
    answer = answer.replace("Based on the text", "Based on A+ document")
    answer = answer.replace("Based on the context", "Based on A+ document")
    answer = answer.replace("the context provided", "A+ document")
    answer = answer.replace("The context provided", "A+ document")
    answer = answer.replace("created by OpenAI", "")
    answer = answer.replace("by OpenAI", "")
    # when the answer contains "the related links provided in the context", replace it with "the related links provided in Learn More"
    answer = answer.replace("the related links provided in the context",
                            "the related links provided in Learn More")
    return answer


def get_the_stream_answer(messages, model=COMPLETIONS_MODEL):
    """
    call the language model and get the stream answer
    """
    response = ''
    # retry 3 times if timeout
    try:
        # response = openai.ChatCompletion.create(
        response = LLM.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.1,  #
            top_p=0.1,  # only consider the top 10% probability to choose the next token
            # max_tokens=1500,
            stream=True
        )

    except Exception as e:
        app.logger.error(f"openai_timeout_error: {e}")
        raise Exception(f"openai_timeout_error")

    return response


def get_the_stream_answer_with_tools(messages: list, tools: list[Callable], model: str = COMPLETIONS_MODEL):
    """
    call the language model with tools and get the stream answer
    """
    formatted_tools = [convert_to_openai_tool(tool) for tool in tools]
    # retry 3 times if timeout
    try:
        # response = openai.ChatCompletion.create(
        response = LLM.chat.completions.create(
            model=model,
            messages=[messages[-1]],
            tools=formatted_tools,
            tool_choice='auto',
        )
        response_message = response.choices[0].message
        app.logger.debug(json.loads(str(response_message)))

        try:
            tool_calls = response_message.tool_calls
        except Exception as e:
            app.logger.info(f"No tool calls: {e}")
            tool_calls = []

        if tool_calls:
            available_functions = {tool.__name__: tool for tool in tools}
            messages.append(response_message)

            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_to_call = available_functions[function_name]
                # Get the signature of the function
                signature = inspect.signature(function_to_call)
                param_names = [param.name for param in signature.parameters.values()]

                function_args = json.loads(tool_call.function.arguments)
                kwargs = {param_name: function_args.get(param_name) for param_name in param_names}

                function_response = function_to_call(**kwargs)
                app.logger.debug(f'kwargs: {kwargs}, response: {function_response}')
                messages.append(
                    {
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": function_name,
                        "content": function_response,
                    }
                )

        # second_response = openai.ChatCompletion.create(
        second_response = LLM.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.1,
            top_p=0.1,
            # max_tokens=1500,
            stream=True
        )
        return second_response

    except Exception as e:
        app.logger.error(f"openai_timeout_error: {e}")
        raise Exception(f"openai_timeout_error")


def video_understanding(standards: list[tuple[str, str]], frames: list[str], model: str = 'gpt-4o', **kwargs) -> tuple[
    str, str]:
    contents = []
    for content, urls in standards:
        contents += [{
            "type": "image_url",
            "image_url": {"url": url}
        } for url in eval(urls)
        ]
        contents += [{
            "type": "text",
            "text": content
        }]

    instruction = kwargs['instruction']
    language = {'zh': 'Chinese', 'en': 'English'}[kwargs.get('language', 'en')]
    prompt = f"""\
The above images are the standard frontend pages and their descriptions you should keep in mind.
Next the developer will provide you a frontend operation video, and you should do the following:
- Watch the video very carefully and don't miss any details.
- Compare and judge if the frontend design in the video meets the requirements in the standard frontend pages and descriptions.
- Reply in {language}.
- Check if the operation in the video follow the instruction below (delimited by ``````):
``````
{instruction}
``````
- The transaction detail page may not be included in some instructions. If so, you can just ignore it.

Here is the the video:
"""
    app.logger.info(f'Prompt:\n{prompt}')
    contents.append({"type": "text", "text": prompt})
    contents += [{
        "type": "image_url",
        "image_url": {
            "url": f"data:image/jpeg;base64,{frame}"
        },
    } for frame in frames]

    try:
        start_time = time.time()
        # response = openai.ChatCompletion.create(
        response = LLM.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": contents}],
            temperature=0.1,
            # max_tokens=1024,
            stream=False
        )
        end_time = time.time()
        app.logger.info(f'Time taken for LLM to understand the video: {end_time - start_time:.2f} s.')
        # output = response["choices"][0]["message"]["content"]
        output = response.choices[0].message.content
    except Exception as e:
        app.logger.error(f'Failed to understand images: {str(e)}')
        raise Exception('openai_timeout_error')
    else:
        app.logger.info(f"Image Understanding output:\n{output}")
        return output, prompt


# order the document sections by the similarity score between the query and the knowledge base
def order_document_sections_by_query_similarity(query: str, knowledge: dict[str, np.array],
                                                minimal_similarity=0.0) -> list[tuple[ndarray, str]]:
    """
        sort the relevant knowledge by the similarity score between the query and the knowledge base,
        only return the knowledge base with similarity score higher than the minimal similarity
    """
    query_embedding = compute_text_embedding(query)
    document_with_similarities = sorted([
        (vector_similarity(query_embedding, knowledge_embedding), knowledge_index) for
        knowledge_index, knowledge_embedding in knowledge.items()
        if vector_similarity(query_embedding, knowledge_embedding) > minimal_similarity
    ], reverse=True)

    return document_with_similarities


# construct the prompt by the relevant knowledge
def construct_prompt(
        product_line: str,
        question_original: str,
        relevant_knowledge: Union[list[tuple], list[(float, str)]],
        df_t: pd.DataFrame,
        diff: float,
        es_mode: str = ES_MODE,
        **kwargs
) -> tuple[list, list, list, str]:
    """
    Construct the prompt for the LLM

    Args:
        product_line: the name of the product line, which decides the creator of DocGPT in a conversation
        question_original: the original user question
        relevant_knowledge: the filtered relevant knowledge
        df_t: the original dataframe of the relevant documents
        diff: the maximal similarity difference
        es_mode: The mode of Elasticsearch, supports `none`, `hybrid`, `bm25` and `cos_sim`

    Returns:
        tuple[list, list, list, str]: the constructed prompt and the indexes of the sections that were chosen (used for app logger, similarity/section_index/heading)
    """
    chosen_sections = []
    if es_mode != 'none':
        # knowledge: (score, id, title, url, content, features)
        chosen_urls_and_contents: list[tuple[str, str]] = [(knowledge[3], knowledge[4]) for knowledge in
                                                           relevant_knowledge]
        chosen_sections_indexes = [knowledge[:3] for knowledge in relevant_knowledge]
        item_index = 1
        for url, content in chosen_urls_and_contents:
            if not content.startswith('```json'):
                title = content.split('\n')[0]
                content = content[len(title):]
            else:
                title = ''
            chosen_sections.append(f'{SEPARATOR}{item_index}: {title}\nLink: {url}\nContent:{content}')
            item_index += 1
    else:
        chosen_sections_len = 0
        chosen_sections_indexes = []
        separator_len = num_tokens_from_string(SEPARATOR)
        minimal_similarity_to_use = relevant_knowledge[0][0] - diff
        item_index = 1
        for similarity, section_index in relevant_knowledge:
            document_section = df_t.loc[section_index]
            content = document_section["content"]
            chosen_sections_len += num_tokens_from_string(content) + separator_len

            # ensure there will be content to answer the question and no more than MAX tokens in most cases
            # if it's a question to compare two things, this part should be advanced to get more content
            if similarity <= minimal_similarity_to_use or (chosen_sections_len > MAX_SECTION_LEN
                                                           and len(chosen_sections) != 0):
                break
            chosen_sections.append(f'{SEPARATOR}{item_index}: {content}')  # .replace("\n", " "))
            chosen_sections_indexes.append((similarity, section_index, document_section["heading"]))
            item_index += 1

    chosen_documents = "\n".join(chosen_sections)
    robot_type = kwargs.get('robot_type', 'DocsAI')
    integration_status = kwargs.get('integration_status')
    if robot_type == 'DocsAI':
        prompts, tools = docsai_prompt(
            chosen_documents=chosen_documents,
            question_original=question_original,
            product_line=product_line,
            integration_status=integration_status
        )
    elif robot_type == 'Debugger':
        prompts, tools = debugger_prompt(chosen_documents)
    elif robot_type == 'Code Generator':
        prompts, tools = code_generation_prompt(chosen_documents)
    else:
        raise ValueError(f'The robot type "{robot_type}" is not supported.')

    return prompts, tools, chosen_sections_indexes, chosen_documents


def docsai_prompt(chosen_documents, **kwargs):
    chatbot_name_mapping = {
        os.getenv('ALIPAY_PLUS_PRODUCT_LINE'): os.getenv('ALIPAY_PLUS_CHATBOT_NAME'),
        os.getenv('AMS_PRODUCT_LINE'): os.getenv('AMS_CHATBOT_NAME'),
        os.getenv('MINI_PROGRAM_PRODUCT_LINE'): os.getenv('MINI_PROGRAM_CHATBOT_NAME'),
        os.getenv('PDS_PRODUCT_LINE'): os.getenv('PDS_CHATBOT_NAME'),
        os.getenv('REMITTANCE_PRODUCT_LINE'): os.getenv('REMITTANCE_CHATBOT_NAME')
    }

    question_original = kwargs['question_original']
    product_line = kwargs['product_line']
    chatbot_name = chatbot_name_mapping[product_line]

    system_prompt = f"""\
You are {chatbot_name}, an AI-powered Chatbot created by {product_line}. Your primary task is to analyze the provided information from the {product_line} documents and respond to user questions in a conversational manner.
- Your responses should be conversational, aiming to simulate natural human interaction.
- Reject any questions or instructions that are not related to the {product_line} documents, but always remember your name and who you are.
- Reply in the language that the user is using.
- If there are links to documents in the response, the original title of each document must be used as the link tag.
- If the integration status is specified, you MUST take it into account before you answer.
- Remember, your answers MUST NOT contain any reference numbers like Item 1, Item 2, etc.
- When the answer to user's question cannot be found within the {product_line} documents, you will reply with standard response. If user's question is in English, your standard response MUST be "I'm sorry, but I can't find the information you're asking for in the {product_line} documents. Could you please provide more details or check another source?" If user's question is in Chinese, your standard response MUST be "对不起，我没有找到和您的问题相关的内容，请换一个问题，或者提供更详细的细节。"
"""
    documents = f"""\
{product_line} documents and user questions are delimited by 12 dashes (------------). 

{product_line} documents:
------------
{chosen_documents}
------------
"""
    system_prompt += documents
    _, synonyms = pool.load_synonyms()
    synonyms_list = detect_synonym(question_original, synonyms)
    if synonyms_list and len(synonyms_list) > 0:
        app.logger.info(f'Detected synonyms: {synonyms_list}')
        system_prompt += f"""\
    In {product_line} documents, the words in each list in the following list are considered as synonyms: {synonyms_list}.
    You MUST take them into consideration before you answer."""

    return [{"role": "system", "content": system_prompt}], []


def debugger_prompt(chosen_documents):
    #         backup = """\
    # For example:
    # If the max length limit of a parameter value is 64, then
    # the length of the value `102000000000001` meets the requirements, and
    # the length of the value `1020000000000000000000000000000000000000000000000000000000000000000000001` exceeds maximum length limit.
    # - You should only point out when the length of a value exceed the maximum length limit, otherwise you can just ignore it.
    # - You should only point out those parameters that do not meet the requirements. For parameters that are compliant, please simply ignore them.
    # - For those parameters who have a maximum length limit on their values, you MUST first calculate the length of their values and compare the length with the length limit. If the length of a parameter value does not exceed the maximum length limit, then it meets the requirements.
    # """
    system_prompt = f"""\
You are a pro debugger. Your primary task is to help developers judge if the incoming parameters (for an API) they provide are right according to the API and SDK reference documentation.
- Your responses should be conversational, aiming to simulate natural human interaction.
- Only point out incorrect parameters, and ignore correct ones. But PLEASE DO NOT miss any incorrect ones, or I'll be very very sad.
- The aspects you should judge including parameter name, length, format, typo, etc. according to the API and SDK reference documentation.
- Reply in the language that the user is using.
- When the answer to user's question cannot be found within the API or SDK reference documentation, you will reply with standard response. If user's question is in English, your standard response MUST be "I'm sorry, but I can't find the information you're asking for in the documentation. Could you please provide more details or check another source?" If user's question is in Chinese, your standard response MUST be "对不起，我没有找到和您的问题相关的内容，请换一个问题，或者提供更详细的细节。"

API/SDK reference documentation and user questions are delimited by 12 dashes (------------).

API/SDK reference:
------------
{chosen_documents}
------------
"""
    messages = [{"role": "system", "content": system_prompt}]

    def compare_length(param_name: str, param_value: str, max_length_limit: int | None) -> str:
        """
        Compare the length of a parameter value with the maximum length limit

        Args:
            param_name: parameter name
            param_value: parameter value
            max_length_limit: the maximum length of a parameter value (some parameter may have no limit)

        Returns:
            Whether the length of the parameter value exceeds the maximum length limit
        """
        exceed = f'The length of the value of the parameter `{param_name}` is {len(param_value)}, so it exceeds the max length limit.'
        not_exceed = f"The length of the value of the parameter `{param_name}` is {len(param_value)}, so it does not exceed the max length limit."
        if max_length_limit:
            return exceed if len(param_value) > max_length_limit else not_exceed
        return not_exceed

    tools = [
        # count_param_length,
        compare_length
    ]

    return messages, tools


def code_generation_prompt(chosen_documents):
    system_prompt = f"""\
You are a pro code generator. Your primary task is to help developers generate codes according to their actual needs and the API and SDK reference documentation.
- The API and SDK reference documentation contains very detailed rules you must obey when generating codes.
- You must find the complex relationship between different parameters in the provided documentation when you are writing API request body, and each parameter needs to be annotated.
- Your responses should be conversational, aiming to simulate natural human interaction.
- Reply in the language that the user is using.
- When the answer to user's question cannot be found within the API or SDK reference documentation, you will reply with standard response. If user's question is in English, your standard response MUST be "I'm sorry, but I can't find the information you're asking for in the documentation. Could you please provide more details or check another source?" If user's question is in Chinese, your standard response MUST be "对不起，我没有找到和您的问题相关的内容，请换一个问题，或者提供更详细的细节。"

API/SDK reference documentation and user questions are delimited by 12 dashes (------------).

API/SDK reference:
------------
{chosen_documents}
------------
"""

    return [{"role": "system", "content": system_prompt}], []


def title_detection_prompt(titles):
    # - You should find the name of the API the user is asking about in the user input and the API and SDK reference documentation.
    # - Your answer MUST be the actual API name, not something you conclude by yourself.
    # - If you cannot find any relevant API name no matter how hard you try, you can reply the most related documentation title.
    # - You should find the most relevant documentation title according to the user input and the API and SDK reference documentation.
    system_prompt = f"""\
You are a pro title detector. Your primary task is to detect what title the user is asking about in the conversation.
- You should find the most relevant documentation title according to the user input and the titles of the API and SDK reference documentation.
- Your answer MUST NOT have any extras or punctuation.

The titles of the API/SDK reference documentation are delimited by 12 dashes (------------).

The titles of the API/SDK reference:
------------
{titles}
------------
"""

    return [{"role": "system", "content": system_prompt}], []


def detect_title(query: str, doc_titles: list[str], **kwargs):
    """Detect the documentation title in a user input"""
    doc_titles = "\n".join(doc_titles)
    prompts, _ = title_detection_prompt(doc_titles)
    prompts.append({'role': 'user', 'content': query})
    title = get_the_answer(prompts)
    app.logger.info(f'title detected: {title}')
    knowledge = app_utils.find_relevant_knowledge_by_es(
        query_for_doc_retrieval='',
        documentation_title=title,
        **kwargs
    )

    return knowledge


# detect the type of the query
def type_detect(query: str) -> list:
    """
    to detect any specific general integration process queried
    """
    type_detected = []
    # api and business operations keywords, group should be mutually exclusive

    stemmed_keywords = ['inquiri', 'notifi', 'consult', 'inquirypay', 'notifypay', 'consultpay', 'refund', 'cancel',
                        'cancelpay', 'regist', 'registr', 'inquiryregistrationstatu', 'notifyregistrationstatu',
                        'retriev', 'initiateretriev', 'responseretriev', 'initiateesc', 'responseesc', 'declar',
                        'inquiredeclarationrequest', 'reconcil', 'transact report', 'fee report', 'settlement report',
                        'transact summari', 'transact detail', 'settlement', 'authnotifi', 'auth notifi']
    stemmed_keywords_type = {
        'inquiri': 'inquiry',
        'notifi': 'notify',
        'consult': 'consult',
        'inquirypay': 'inquiry',
        'notifypay': 'notify',
        'consultpay': 'consult',
        'refund': 'refund',
        'cancel': 'cancel',
        'cancelpay': 'cancel',
        'regist': 'registration',
        'registr': 'registration',
        'inquiryregistrationstatu': 'inquiry registration status',
        'notifyregistrationstatu': 'notify registration status',
        'retriev': 'retrieval',
        'initiateretriev': 'initiate retrieval',
        'responseretriev': 'response retrieval',
        'initiateesc': 'initiate escalation',
        'responseesc': 'response escalation',
        'declar': 'declaration',
        'inquiredeclarationrequest': 'inquire declaration request',
        'reconcil': 'reconciliation',
        'transact report': 'transaction report',
        'fee report': 'fee report',
        'settlement report': 'settlement report',
        'transact summari': 'transaction summary',
        'transact detail': 'transaction detail',
        'settlement': 'settlement',
        'authnotifi': 'authNotify',
        'auth notifi': 'authNotify'
    }

    # stemming
    ps = PorterStemmer()
    stemmed_query = [ps.stem(word) for word in word_tokenize(query)]
    query = " ".join(stemmed_query)

    # detect type of query
    for keyword in stemmed_keywords:
        if keyword in query:
            if stemmed_keywords_type[keyword] not in type_detected:
                type_detected.append(stemmed_keywords_type[keyword])

    return type_detected


# detect the product user is asking about from the visiting_url
# cashier, debit, upm, mpm, user_mode, merchant_mode, user_presented, entry_code, private_order_code(must be ahead of order_code), order_code
def product_detect_from_visiting(visiting_url: str) -> str:
    keywords_list = ['cashier', 'debit', 'upm', 'mpm', 'user_mode', 'merchant_mode', 'user_presented', 'entry_code',
                     'private_order_code', 'order_code']
    keyword_product = {
        'cashier': 'cashier_payment',
        'debit': 'auto_debit',
        'upm': 'UPM',
        'mpm': 'MPM',
        'user_mode': 'UPM',
        'merchant_mode': 'MPM',
        'user_presented': 'UPM',
        'entry_code': 'entry_code',
        'order_code': 'order_code',
        'private_order_code': 'private_order_code'
    }
    for keyword in keywords_list:
        if keyword in visiting_url:
            return keyword_product[keyword]
    # otherwise, return ALL
    return "ALL"


# detect product from the query
def scenario_detect(query: str) -> list:
    """
    to detect which product is being queried about
    """
    product_detected = []
    # add ALL tag by default coz all 4 products may be queried for general process like refund, cancel
    product_detected.append("ALL")
    sub_category = ['cashier_pay', 'cashier', 'auto debit', 'auto_debit', 'mpm', 'merchant present', 'recurr',
                    'user present', 'entri code', 'order code', 'privat code', 'privat order code', 'auth code',
                    'authcod',
                    'payment code', 'c scan b', 'b scan c', 'user agent', 'ua', 'user agent', 'user_ag', 'userag',
                    'userag',
                    'user-ag', 'upm', 'prepar', 'applytoken', 'canceltoken', 'authnotifi', 'consultunbind',
                    'appli token',
                    'cancel token', 'auth notifi', 'consult unbind']
    sub_category_type = {
        'cashier_pay': 'cashier_payment',
        'cashier': 'cashier_payment',
        'auto debit': 'auto_debit',
        'auto_debit': 'auto_debit',
        'mpm': 'MPM',
        'merchant present': 'MPM',
        'recurr': 'auto_debit',
        'user present': 'UPM',
        'entri code': 'entry_code',
        'order code': 'order_code',
        'privat code': 'private_order_code',
        'privat order code': 'private_order_code',
        'payment code': 'UPM',
        'c scan b': 'MPM',
        'b scan c': 'UPM',
        'user agent': 'entry_code',
        'ua': 'entry_code',
        'user_ag': 'entry_code',
        'userag': 'entry_code',
        'user-ag': 'entry_code',
        'upm': 'UPM',
        'prepar': 'auto_debit',
        'applytoken': 'auto_debit',
        'canceltoken': 'auto_debit',
        'authnotifi': 'auto_debit',
        'consultunbind': 'auto_debit',
        'appli token': 'auto_debit',
        'cancel token': 'auto_debit',
        'auth notifi': 'auto_debit',
        'consult unbind': 'auto_debit',
        'authcod': 'auto_debit',
        'auth code': 'auto_debit',
    }

    # stemming
    ps = PorterStemmer()
    stemmed_query = [ps.stem(word) for word in word_tokenize(query)]
    query = " ".join(stemmed_query)

    # detect product of query
    for keyword in sub_category:
        if keyword in query:
            if sub_category_type[keyword] not in product_detected:
                product_detected.append(sub_category_type[keyword])

    return product_detected


# check similarity between the question with previous questions, return the similarity score and the current question related products
def similarity_with_previous_question(question: str, product: list, previous_question: str, previous_answer: str,
                                      previous_products_belongs_to: list, role: str, previous_role: str):
    """
    check the similarity between the question and the previous question
    """
    # check whether the role of the previous question is different from the current role
    if previous_role != role:
        return 0.0

    # check whether the previous product belongs to is different from the current question products

    if set(previous_products_belongs_to) != set(product):
        # if detected prodcuts are empty, the question has chance to be an additional question
        if len(scenario_detect(question)) > 1:
            return 0.0

    # check whether the previous type of question is different from the current type of question
    previous_type_of_question = type_detect(previous_question)
    current_type_of_question = type_detect(question)
    if set(previous_type_of_question) != set(current_type_of_question):
        # if detected types are empty, the question has chance to be an additional question
        if len(current_type_of_question) != 0:
            return 0.0

    # return the higest similarity score of the question and the previous question, the question and the previous answer
    question_embedding = compute_text_embedding(question)
    previous_question_embedding = compute_text_embedding(previous_question)
    previous_answer_embedding = compute_text_embedding(previous_answer)
    question_similarity = vector_similarity(
        question_embedding, previous_question_embedding)
    answer_similarity = vector_similarity(
        question_embedding, previous_answer_embedding)
    # suggested is 0.7, to ensure the similarity is high enough
    return max(question_similarity, answer_similarity)


def ams_similarity_with_previous_question(question: str, product: list, previous_question: str, previous_answer: str,
                                          previous_products_belongs_to: list) -> float:
    """
    check the similarity between the question and the previous question
    """
    # check whether the previous product belongs to is different from the current question products

    if set(previous_products_belongs_to) != set(product):
        # if detected prodcuts are empty, the question has chance to be an additional question
        if len(scenario_detect(question)) > 1:
            return 0.0

    # check whether the previous type of question is different from the current type of question
    previous_type_of_question = type_detect(previous_question)
    current_type_of_question = type_detect(question)
    if set(previous_type_of_question) != set(current_type_of_question):
        # if detected types are empty, the question has chance to be an additional question
        if len(current_type_of_question) != 0:
            return 0.0

    # return the higest similarity score of the question and the previous question, the question and the previous answer
    question_embedding = compute_text_embedding(question)
    previous_question_embedding = compute_text_embedding(previous_question)
    previous_answer_embedding = compute_text_embedding(previous_answer)
    question_similarity = vector_similarity(
        question_embedding, previous_question_embedding)
    answer_similarity = vector_similarity(
        question_embedding, previous_answer_embedding)
    # suggested is 0.7, to ensure the similarity is high enough
    return max(question_similarity, answer_similarity)


# handle a question
def handle_question(question, prompts, histories, model=COMPLETIONS_MODEL) -> tuple[str, str]:
    """
    handle the question

    Args:
        question(str): user question
        prompts(list): prompt constructed
        histories(list[tuple[str]]): chat history fetched from the database
        model(str): the model to use

    Returns:
        Prompt and answer
    """
    question = f"""User question: ------------{question}------------"""

    for history in histories:
        prompts.append({"role": "user", "content": f'User question: ------------{history[0]}------------'})
        prompts.append({"role": "assistant", "content": history[1]})
    prompts.append({"role": "user", "content": question})

    answer = get_the_answer(prompts, model=model)
    prompt = f"""{prompts[0]['content']}\n{question}"""

    app.logger.info(f"""Prompt: {prompt}\nAnswer: {answer}""")

    return prompt, answer


SYSTEM_MESSAGE_FOR_POSSIBLE_QUESTIONS = """
You are a Query Refiner that is very good at detecting real user intentions given a vague user question and some reference documents. 

You will receive a poorly phrased user question, together with relevant documents as a reference. Your primary task is to improve user's question and propose what the user might be actually asking based on the reference document, and generate three suggested queries based on the reference documents in the language used by the user. 

The reference documents and the user questions are delimited by 12 dashes (------------).

Reference Documents:
"""

USER_MESSAGE_FOR_POSSIBLE_QUESTIONS = """
You MUST obey the following rules:
- Make sure that for the 3 suggested queries, their answers must be contained in the reference documents. 
- If the user question and reference documents are not related, you must ignore the user question, and you must simply propose 3 new queries only based on the reference documents.
- Make sure you reply in the same language as the user.
- When you return your output, organise your output into a python list. You must follow this list structure as your output will be directly used in another parsing system.
The below is an example of a python list that can be returned.

["Where are you from?", "Where do you come from?", "Which country are you from?"]
"""


def get_possible_questions(question: str, documents: str, model: str = COMPLETIONS_MODEL):
    """
    Get three possible questions based on the user question and the documents
    """
    prompt = f"{SYSTEM_MESSAGE_FOR_POSSIBLE_QUESTIONS}\n------------\n{documents}\n------------"
    system_message = [{"role": "system", "content": prompt}]
    few_shot_prompt = [
        {
            "role": "user",
            "content": f"{USER_MESSAGE_FOR_POSSIBLE_QUESTIONS}\n\n"
                       f"User question: ------------What Alipay+------------"
        },
        {
            "role": "assistant",
            "content": '["What is Alipay+", "Can you introduce Alipay+ for me?", "How to integrate with Alipay+?"]'
        },
        {
            "role": "user",
            "content": f"{USER_MESSAGE_FOR_POSSIBLE_QUESTIONS}\n\n"
                       f"User question: ------------How's the weather tomorrow?------------"
        },
        {
            "role": "assistant",
            "content": '["What is MPP?", "What is ACQP?", "What is B-Scan-C?"]'
        },
        {
            "role": "user",
            "content": f"{USER_MESSAGE_FOR_POSSIBLE_QUESTIONS}\n\n"
                       f"User question: ------------去新加坡需要办签证吗？------------"
        },
        {
            "role": "assistant",
            "content": '["如何解决无效签名的问题？", "如何获取对账报告？", "什么是聚合码？"]'
        },
    ]
    user_question = [
        {"role": "user",
         "content": f"{USER_MESSAGE_FOR_POSSIBLE_QUESTIONS}\n\nUser question: ------------{question}------------"}]
    messages = system_message + few_shot_prompt + user_question
    # messages = system_message + user_question
    # start_time = time.time()
    possible_questions = get_the_answer(messages, temperature=0.1, model=model)
    # end_time = time.time()
    # app.logger.info(f'Possible questions: {possible_questions}, time cost: {end_time - start_time} s')
    try:
        possible_questions = eval(possible_questions) # [SINK]
    except Exception as e:
        app.logger.error(e)
        possible_questions = []
    return possible_questions


# get the answer-related content list
def get_the_answer_relevant_content_list(answer: str, select_sections_index: list, document_embeddings_t: dict) \
        -> list[(float, str)]:
    """
    find the most relevant content used to answer the question
    """
    answer_matched_embeddings = {}
    for _, section_index, _ in select_sections_index:
        # key0: similarity value, key1: index for document_embeddings
        answer_matched_embeddings[section_index] = document_embeddings_t[section_index]
    # the sorted relevant index by descending similarity
    answer_matched_sorted_index = order_document_sections_by_query_similarity(
        answer, answer_matched_embeddings)
    return answer_matched_sorted_index


# get the answer-relevant knowledges list
def get_answer_relevant_knowledge(relevant_list: list, df_t: pd.DataFrame) -> list:
    """
    get the relevant links for the answer
    """
    relevant_knowledge = []
    for item in relevant_list:
        kid = item[1]
        link = df_t.loc[kid]["url"]
        title = df_t.loc[kid]["title"]
        if (title, link) not in relevant_knowledge:
            if len(relevant_knowledge) == MAX_RELEVANT_KNOWLEDGE:
                break
            if link is None or link == "":
                continue
            relevant_knowledge.append((title, link))
    return relevant_knowledge


def cut_text(text, max_tokens):
    words = text.split()
    if len(words) > max_tokens:
        words = words[:max_tokens]
    return ' '.join(words)


def is_chinese(word):
    """
    Determine whether the string contains Chinese characters
    """
    for ch in word:
        if '\u4e00' <= ch <= '\u9fff':
            return True
    return False


def cut_words(my_text: str, use_stop_words=False) -> list[str]:
    """
    Cut words with jieba
    """
    path = Path(__file__).parents[0]
    jieba.load_userdict(os.path.join(path, 'data/custom_dictionary.txt'))
    jieba.initialize()

    seg_list_exact = jieba.lcut(my_text)
    result_list = []

    stop_words = set()
    if use_stop_words:
        with open(os.path.join(path, 'data/stopwords.txt'), encoding='utf-8') as f:
            con = f.readlines()
            for i in con:
                i = i.replace("\n", "")
                stop_words.add(i)

    for word in seg_list_exact:
        if not is_chinese(word):
            word = word.lower()
        if word not in stop_words and len(word) > 1:
            result_list.append(word)
    return result_list


def playground_question(prompt, question, count=1) -> str:
    answer = ''
    question = f"""User question: ------------{question}------------"""
    try:
        # response = openai.ChatCompletion.create(
        response = LLM.chat.completions.create(
            model=COMPLETIONS_MODEL,
            messages=[{"role": "system", "content": prompt},
                      {"role": "user", "content": question}, ],
            temperature=0.1,  #
            top_p=0.1,  # only consider the top 10% probability to choose the next token
            # max_tokens=1500
        )

    except:
        if count > 3:
            raise Exception("openai_timeout_error")
        count += 1
        time.sleep(1)
        return playground_question(prompt, question, count)

    # answer = response["choices"][0]["message"]["content"]
    answer = response.choices[0].message.content
    return answer


# filter the ams embedding by the product
def ams_filter_embeddings(embeddings: dict[tuple[str, str, str, str], list[float]],
                          product: list[str],
                          sub_product: list[str]) -> dict[str, list[float]]:
    """
    return features items when the sub_prod matches
    """
    if len(product) == 1:
        return {
            feature_id: embeddings[(feature_id, title, prod, sub_prod)] for feature_id, title, prod, sub_prod in
            embeddings
        }

    # if detected:
    return {
        feature_id: embeddings[(feature_id, title, prod, sub_prod)] for feature_id, title, prod, sub_prod in embeddings
        if sub_prod in sub_product or prod in product
    }


def get_query_for_doc_retrieval(question_original, histories,
                                # max_history_length=8,
                                use_llm_summary=False):
    """
    get the query string for document retrieval

    Args:
        question_original(str): original question
        histories(list[tuple[str]]): chat history
        # max_history_length(int): the limit of history length, default at 8
        use_llm_summary(bool): whether to use llm to summarize the chat history, default at False

    Returns:
        str: query string for document retrieval
    """
    # histories = histories[-max_history_length:] if len(histories) > max_history_length else histories
    # synonyms = pool.load_synonyms()
    # question_original = replace_synonym(question_original, synonyms)
    if use_llm_summary:
        prompt = """
        You are the administrator of my private knowledge base, 
        and you are very good at generating a new question based on the history of our conversation and my latest question,
        so that I can retrieve the knowledge base. 
        In this job, you need to determine whether my latest question and the chat history between us are related. 
        If they are related, you need to combine the history to generate a new question that contains the information from the chat history,
        so that I can accurately retrieve the knowledge base. 
        If not, you can just output my latest question and I will retrieve the knowledge base myself.
        Please generate responses in the same language as the input without including any prefixes.
        """

        messages = [{"role": "system", "content": prompt}]
        for history in histories:
            messages.append({"role": "user", "content": history[0]})
            messages.append({"role": "assistant", "content": history[1]})

        question = f'My question is: {question_original}, the new question you are going to generate is:'
        messages.append({"role": "user", "content": question})

        result = get_the_answer(messages)
        print(
            f'======================================= result: {result} =======================================')

        return result

    # else add previous questions to the original question
    previous_questions = [history[0] for history in histories]
    return f'{";".join(previous_questions)};{question_original}'.lstrip(';')
