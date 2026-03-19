import json
import os
import random
import time

import pandas as pd
from flask import current_app as app
from openai import Stream
from openai.types.chat import ChatCompletionChunk

from src import aiutils, ams_utils
from src import app_service
from src import safeutils, app_utils

COMPLETIONS_MODEL = os.getenv('COMPLETIONS_MODEL')
INFOSEC_STREAM_BUFFER_LENGTH = int(os.getenv('INFOSEC_STREAM_BUFFER_LENGTH'))


def ams_generator(chat_req: Stream[ChatCompletionChunk], question_original,
                  username, chosen_sections_indexes, filtered_document_embeddings,
                  ams_df, email, chat_id, prompt, product, app_sense):
    buffer = ""
    checked_length = 0
    for trunk in chat_req:
        # if trunk['choices'][0]['finish_reason'] is not None:
        if trunk.choices[0].finish_reason is not None:
            # 当对话结束时，检查并输出缓冲区中的剩余内容
            success, message = safeutils.info_security_check(query=question_original, answer=buffer,
                                                             appScene=app_sense, username=username)
            if success:
                # re = trunk['choices'][0]['delta'].get('content', '')
                content = trunk.choices[0].delta.content
                re = content if content else ''
                re += '[DONE]'
                yield re

                result = ams_store_question_and_answer(username, email, question_original, buffer,
                                                       prompt, chat_id, product, chosen_sections_indexes,
                                                       filtered_document_embeddings, ams_df)

                # 使用 yield 发送 JSON 字符串，并按照流事件的格式编码
                yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
            else:
                yield "[UNSAFE_CONTENT]"

                result = ams_store_question_and_answer(username, email, question_original, buffer,
                                                       prompt, chat_id, product, chosen_sections_indexes,
                                                       filtered_document_embeddings, ams_df)

                yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                break

        else:
            # 获取新产生的内容并添加到缓冲区
            # re = trunk['choices'][0]['delta'].get('content', '')
            content = trunk.choices[0].delta.content
            re = content if content else ''
            yield re
            buffer += re

            if len(buffer) - checked_length >= 10:
                # 检查缓冲区内容
                if safeutils.info_security_check(query=question_original, answer=buffer,
                                                 appScene=app_sense, username=username)[0] is True:
                    checked_length = len(buffer)
                else:
                    yield "[UNSAFE_CONTENT]"

                    result = ams_store_question_and_answer(username, email, question_original, buffer,
                                                           prompt, chat_id, product, chosen_sections_indexes,
                                                           filtered_document_embeddings, ams_df)

                    # 使用 yield 发送 JSON 字符串，并按照流事件的格式编码
                    yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                    break


def ams_store_question_and_answer(username, email, question_original, answer_data_string,
                                  prompt, chat_id, product, chosen_sections_indexes, filtered_document_embeddings,
                                  ams_df):
    # 存储问题和答案
    relevant_content_list = aiutils.get_the_answer_relevant_content_list(
        answer_data_string, chosen_sections_indexes, filtered_document_embeddings)
    relevant_knowledges_links = aiutils.get_answer_relevant_knowledge(
        relevant_content_list, ams_df)

    further_reading_json = json.dumps(relevant_knowledges_links)

    question_id = app_service.ams_store_question_and_answer(
        username, email, question_original, answer_data_string,
        further_reading_json, prompt, chat_id, product, '')

    return {
        "chat_id": chat_id,
        "further_reading": relevant_knowledges_links,
        "question_id": question_id}


def ams_generator2(response, username, email, question, submitType):
    sessionId = ''
    question_id = ''
    content = ''
    traceId = ''
    type = ''
    further_readings = []
    result = {
        "chat_id": sessionId,
        "further_reading": further_readings,
        "question_id": question_id,
        "answer": content,
        "traceId": traceId,
        "type": type
    }

    try:
        for line in response.iter_lines():
            # 忽略空行
            if line:
                if line.decode('utf-8') == "data:[DONE]":
                    question_id = app_service.ams_store_question_and_answer(username, email, question, content,
                                                                            '', '', sessionId, '', submitType)
                    result['chat_id'] = sessionId
                    result['further_reading'] = further_readings
                    result['question_id'] = question_id
                    result['answer'] = content
                    result['traceId'] = traceId
                    result['type'] = type
                    result['question'] = question

                    app.logger.info(f"the output event is: " + str(result))
                    yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                    break

                decoded_line = line.decode('utf-8')
                app.logger.info(f"the ilmservice content: " + str(decoded_line))

                if not decoded_line.startswith('data:'):
                    # 跳过"data:"前缀并解析JSON
                    result = json.loads(decoded_line)
                    if not result['success']:
                        result['chat_id'] = sessionId
                        result['further_reading'] = further_readings
                        result['question_id'] = question_id
                        result['answer'] = "system error，please try again."
                        result['traceId'] = traceId
                        result['type'] = type

                        app.logger.info(f"the output event is: " + str(result))
                        yield f"{json.dumps(result, ensure_ascii=False)}\n\n"

                if not json.loads(decoded_line[5:])['success']:
                    result = {
                        "chat_id": sessionId,
                        "further_reading": further_readings,
                        "question_id": question_id,
                        "answer": "system error, please try later",
                        "traceId": traceId,
                        "type": type
                    }

                    app.logger.info(f"the output event is: " + str(result))
                    yield f"{json.dumps(result, ensure_ascii=False)}\n"

                res = json.loads(line.decode('utf-8')[5:])['data']

                type = res['message'][0]['type'] if 'type' in res['message'][0] else None

                if type is None:
                    content = 'Sorry, I could only answer questions about Antom.'

                if type == 'answer':
                    content = res['message'][0]['content']
                    recommends = res['customResponse']['recommend'] if 'recommend' in res['customResponse'] else None
                    result['customResponse'] = res['customResponse'] if 'customResponse' in res else None

                    further_read = []
                    if recommends:
                        for recommend in recommends:
                            further_read.append(recommend['question'])
                            further_read.append(recommend['url'])
                            further_readings.append(further_read)

                if type == 'action':
                    content = res['message'][0]['content']
                    # contentJson = json.loads(content)
                    action = content['action']
                    if action == 'abusive' or action == 'sensitive' or action == 'security':
                        content = 'Sorry, I could only answer questions about Antom.'

                    if action == 'manual':
                        content = ams_utils.composeLinksUrl(username, email)
                        type = 'manual'

                sessionId = res['sessionId']
                traceId = res['debug'].get('DEBUG_TRACER_ID')

                result['chat_id'] = sessionId
                result['further_reading'] = further_readings
                result['question_id'] = question_id
                result['answer'] = content
                result['traceId'] = traceId
                result['type'] = type

                app.logger.info(f"the output event is: " + str(result))
                yield f"{json.dumps(result, ensure_ascii=False)}\n"
            else:
                # 遇到空行，即SSE的消息边界
                yield "\n"

    except Exception as e:
        result['chat_id'] = sessionId
        result['further_reading'] = further_readings
        result['question_id'] = question_id
        result['answer'] = "system error，please try again."
        result['traceId'] = traceId
        result['type'] = type

        app.logger.info(f"the error output event is: " + str(result))
        app.logger.info(f"the error is: " + str(e))

        yield f"{json.dumps(result, ensure_ascii=False)}\n\n"


def ams_rewards_generator(response, username, email, question):
    sessionId = ''
    question_id = ''
    content = ''
    traceId = ''
    type = ''
    further_readings = []
    result = {
        "chat_id": sessionId,
        "further_reading": further_readings,
        "question_id": question_id,
        "answer": content,
        "traceId": traceId,
        "type": type
    }

    try:
        for line in response.iter_lines():
            # 忽略空行
            if line:
                if line.decode('utf-8') == "data:[DONE]":
                    # 获取当前时间戳并转换为整数
                    timestamp = int(time.time())
                    # 生成一个随机数
                    random_number = random.randint(10000, 99999)
                    # 将时间戳和随机数拼接起来，并填充至24位
                    random_id = str(timestamp) + str(random_number)
                    random_id = random_id.ljust(24, '0')

                    question_id = random_id
                    result['chat_id'] = sessionId
                    result['further_reading'] = further_readings
                    result['question_id'] = question_id
                    result['answer'] = content
                    result['traceId'] = traceId
                    result['type'] = type

                    app.logger.info(f"the output event is: " + str(result))
                    yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                    break

                decoded_line = line.decode('utf-8')
                app.logger.info(f"the ilmservice content: " + str(decoded_line))

                if not decoded_line.startswith('data:'):
                    # 跳过"data:"前缀并解析JSON
                    result = json.loads(decoded_line)
                    if not result['success']:
                        result['chat_id'] = sessionId
                        result['further_reading'] = further_readings
                        result['question_id'] = question_id
                        result['answer'] = "system error，please try again."
                        result['traceId'] = traceId
                        result['type'] = type

                        app.logger.info(f"the output event is: " + str(result))
                        yield f"{json.dumps(result, ensure_ascii=False)}\n\n"

                if not json.loads(decoded_line[5:])['success']:
                    result = {
                        "chat_id": sessionId,
                        "further_reading": further_readings,
                        "question_id": question_id,
                        "answer": "system error, please try later",
                        "traceId": traceId,
                        "type": type
                    }

                    app.logger.info(f"the output event is: " + str(result))
                    yield f"{json.dumps(result, ensure_ascii=False)}\n"

                res = json.loads(line.decode('utf-8')[5:])['data']

                type = res['message'][0]['type'] if 'type' in res['message'][0] else None

                if type is None:
                    content = 'Sorry, I could only answer questions about Antom.'

                if type == 'answer':
                    content = res['message'][0]['content']
                    recommends = res['customResponse']['recommend'] if 'recommend' in res['customResponse'] else None

                    further_read = []
                    if recommends:
                        for recommend in recommends:
                            further_read.append(recommend['question'])
                            further_read.append(recommend['url'])
                            further_readings.append(further_read)

                    if res['customResponse']['type'] == 'SEARCH':
                        content = res['message'][0]['content']['searchContents']

                        searchItems = content['SKU']['searchItems']
                        searchItemsList = list(searchItems)

                        output_lines = []  # 创建空列表用于存储每个项目的信息

                        for item in searchItemsList:
                            title = item['searchData']['title']
                            skuPriceList = item['searchData']['skuPriceList']
                            imageUrl = item['searchData']['imageUrl']

                            # 将title, skuPriceList, imageUrl转换成字符串
                            skuPriceList_str = ', '.join(str(price) for price in skuPriceList)
                            # 拼接单个项目信息，并添加到列表中
                            item_info = "\n\n".join([title, skuPriceList_str, imageUrl])
                            output_lines.append(item_info)

                        # 将所有项目信息以 "-------------" 分隔并拼接成单个字符串
                        output_text = "\n\n-------------\n\n".join(output_lines)

                        content = output_text

                        additionalOutputMap = res['customResponse']['additionalOutputMap'] if 'additionalOutputMap' in \
                                                                                              res[
                                                                                                  'customResponse'] else None
                        if additionalOutputMap:
                            output_text = additionalOutputMap.get('outputText1', None)
                            app.logger.info(f"output_text1: " + str(output_text))

                            if output_text:
                                content = output_text + '\n\n' + content

                if type == 'action':
                    content = res['message'][0]['content']
                    # contentJson = json.loads(content)
                    action = content['action']
                    if action == 'abusive' or action == 'sensitive' or action == 'security':
                        content = 'Sorry, I could only answer questions about Antom.'

                    if action == 'manual':
                        content = ams_utils.composeLinksUrl(username, email)
                        type = 'manual'

                sessionId = res['sessionId']
                traceId = res['debug'].get('DEBUG_TRACER_ID')

                result['chat_id'] = sessionId
                result['further_reading'] = further_readings
                result['question_id'] = question_id
                result['answer'] = content
                result['traceId'] = traceId
                result['type'] = type

                app.logger.info(f"the output event is: " + str(result))
                yield f"{json.dumps(result, ensure_ascii=False)}\n"
            else:
                # 遇到空行，即SSE的消息边界
                yield "\n"

    except Exception as e:
        result['chat_id'] = sessionId
        result['further_reading'] = further_readings
        result['question_id'] = question_id
        result['answer'] = "system error，please try again."
        result['traceId'] = traceId
        result['type'] = type

        app.logger.info(f"the error output event is: " + str(result))
        app.logger.info(f"the error is: " + str(e))

        yield f"{json.dumps(result, ensure_ascii=False)}\n\n"


def gpa_generator2(response, username, email, question):
    sessionId = ''
    question_id = ''
    content = ''
    traceId = ''
    type = ''
    further_readings = []
    result = {
        "chat_id": sessionId,
        "further_reading": further_readings,
        "question_id": question_id,
        "answer": content,
        "traceId": traceId,
        "type": type
    }

    try:
        for line in response.iter_lines():
            # 忽略空行
            if line:
                if line.decode('utf-8') == "data:[DONE]":
                    # question_id = app_service.ams_store_question_and_answer(username, email, question, content,
                    #                                                         '', '', sessionId, '')
                    result['chat_id'] = sessionId
                    result['further_reading'] = further_readings
                    result['question_id'] = question_id
                    result['answer'] = content
                    result['traceId'] = traceId
                    result['type'] = type

                    app.logger.info(f"the output event is: " + str(result))
                    yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                    break

                decoded_line = line.decode('utf-8')
                app.logger.info(f"the ilmservice content: " + str(decoded_line))

                if not decoded_line.startswith('data:'):
                    # 跳过"data:"前缀并解析JSON
                    result = json.loads(decoded_line)
                    if not result['success']:
                        result['chat_id'] = sessionId
                        result['further_reading'] = further_readings
                        result['question_id'] = question_id
                        result['answer'] = "system error，please try again."
                        result['traceId'] = traceId
                        result['type'] = type

                        app.logger.info(f"the output event is: " + str(result))
                        yield f"{json.dumps(result, ensure_ascii=False)}\n\n"

                if not json.loads(decoded_line[5:])['success']:
                    result = {
                        "chat_id": sessionId,
                        "further_reading": further_readings,
                        "question_id": question_id,
                        "answer": "system error, please try later",
                        "traceId": traceId,
                        "type": type
                    }

                    app.logger.info(f"the output event is: " + str(result))
                    yield f"{json.dumps(result, ensure_ascii=False)}\n"

                res = json.loads(line.decode('utf-8')[5:])['data']

                type = res['message'][0]['type'] if 'type' in res['message'][0] else None

                if type is None:
                    content = 'Sorry, I could only answer questions about Antom.'

                if type == 'answer':
                    content = res['message'][0]['content']
                    recommends = res['customResponse']['recommend'] if 'recommend' in res['customResponse'] else None

                    further_read = []
                    if recommends:
                        for recommend in recommends:
                            further_read.append(recommend['question'])
                            further_read.append(recommend['url'])
                            further_readings.append(further_read)

                if type == 'action':
                    content = res['message'][0]['content']
                    # contentJson = json.loads(content)
                    action = content['action']
                    if action == 'abusive' or action == 'sensitive' or action == 'security':
                        content = 'Sorry, I could only answer questions about Antom.'

                    if action == 'manual':
                        content = ams_utils.composeLinksUrl(username, email)
                        type = 'manual'

                sessionId = res['sessionId']
                traceId = res['debug'].get('DEBUG_TRACER_ID')

                result['chat_id'] = sessionId
                result['further_reading'] = further_readings
                result['question_id'] = question_id
                result['answer'] = content
                result['traceId'] = traceId
                result['type'] = type

                app.logger.info(f"the output event is: " + str(result))
                yield f"{json.dumps(result, ensure_ascii=False)}\n"
            else:
                # 遇到空行，即SSE的消息边界
                yield "\n"

    except Exception as e:
        result['chat_id'] = sessionId
        result['further_reading'] = further_readings
        result['question_id'] = question_id
        result['answer'] = "system error，please try again."
        result['traceId'] = traceId
        result['type'] = type

        app.logger.info(f"the error output event is: " + str(result))
        app.logger.info(f"the error is: " + str(e))

        yield f"{json.dumps(result, ensure_ascii=False)}\n\n"


def generator(
        chat_req: Stream[ChatCompletionChunk],
        question_original,
        query_for_doc_retrieval,
        username,
        chosen_sections_indexes,
        chosen_documents,
        # chosen_titles_and_urls,
        filtered_document_embeddings,
        df,
        relevant_knowledge,
        es_mode,
        email,
        chat_id,
        prompt,
        role,
        product,
        version,
        app_sense,
        start_time,
        db_tables,
        model=COMPLETIONS_MODEL,
        is_remittance=False,
        **kwargs
):
    buffer = ""
    checked_length = 0
    if es_mode != 'none':
        df = pd.DataFrame({
            kid: {"similarity": similarity,
                  "title": title,
                  "url": url,
                  "content": content,
                  "features": features}
            for similarity, kid, title, url, content, features in relevant_knowledge
        }).T
        filtered_document_embeddings = {kid: eval(features) for _, kid, _, _, _, features in relevant_knowledge}  # [SINK]

    def store_question_and_answer() -> dict:
        app.logger.debug(f'Answer:\n{buffer}')
        llm_found_relevant_knowledge = app_utils.llm_get_knowledge_check(buffer)
        app.logger.info(f'LLM found relevant knowledge: {llm_found_relevant_knowledge}')

        # 如果模型根据用户问题找不到所需的知识，则生成三个建议的问题，并且不提供相关知识链接
        if not llm_found_relevant_knowledge:
            possible_questions = aiutils.get_possible_questions(question_original, chosen_documents, model=model)
            relevant_content_list = []
            relevant_knowledge_links = []
        else:
            possible_questions = []
            # When using Elasticsearch
            if es_mode != 'none':
                # relevant_content_list = []
                # relevant_knowledge_links = chosen_titles_and_urls
                relevant_content_list = aiutils.get_the_answer_relevant_content_list(
                    buffer,
                    chosen_sections_indexes,
                    document_embeddings_t=filtered_document_embeddings
                )
                relevant_knowledge_links = aiutils.get_answer_relevant_knowledge(
                    relevant_content_list, df)
            else:
                # get relevant knowledge list
                relevant_content_list = aiutils.get_the_answer_relevant_content_list(
                    buffer, chosen_sections_indexes, filtered_document_embeddings)
                relevant_knowledge_links = aiutils.get_answer_relevant_knowledge(
                    relevant_content_list, df)

        possible_questions = json.dumps(possible_questions, ensure_ascii=False)
        relevant_knowledge_links = json.dumps(relevant_knowledge_links, ensure_ascii=False)
        question_id = app_service.store_question_and_answer(
            username=username,
            email=email,
            question=question_original,
            answer=buffer,
            possible_questions=possible_questions,
            further_reading=relevant_knowledge_links,
            prompt=prompt,
            chat_id=chat_id,
            role=role,
            product=product,
            version=version,
            response_time=response_time,
            model=model,
            db_table=db_tables.get('LOG_QUESTIONS'),
            data_source=kwargs.get('data_source')
        )

        app_service.stream_log_question_for_analysis(
            chat_id=chat_id,
            question_id=question_id,
            question_text=question_original,
            question_context_similarity=str(chosen_sections_indexes),
            answer_text=buffer,
            answer_context_similarity=str(relevant_content_list),
            status="PASSED" if llm_found_relevant_knowledge else "REJECTED",
            status_message="OK" if llm_found_relevant_knowledge else "GPT_FOUND_NO_KNOWLEDGE",
            prompt=prompt,
            query_for_doc_retrieval=query_for_doc_retrieval,
            db_table=db_tables.get('QUESTION_PROCESSING_LOG'),
            data_source=kwargs.get('data_source')
        )

        return {
            "chat_id": chat_id,
            "possible_questions": possible_questions,
            "further_reading": relevant_knowledge_links,
            "question_id": question_id}

    for trunk in chat_req:
        # if trunk['choices'][0]['finish_reason'] is not None:
        if trunk.choices[0].finish_reason is not None:
            # 当对话结束时，检查并输出缓冲区中的剩余内容
            success, message = safeutils.info_security_check(query=question_original + query_for_doc_retrieval,
                                                             answer=buffer,
                                                             appScene=app_sense,
                                                             username=username,
                                                             is_remittance=is_remittance)
            if success:
                # re = trunk['choices'][0]['delta'].get('content', '')
                content = trunk.choices[0].delta.content
                re = content if content else ''
                re += '[DONE]'
                yield re
                response_time = time.time() - start_time
                result = store_question_and_answer()

                # 使用 yield 发送 JSON 字符串，并按照流事件的格式编码
                yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
            else:
                yield "[UNSAFE_CONTENT]"
                response_time = time.time() - start_time
                result = store_question_and_answer()

                yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                break

        else:
            # 获取新产生的内容并添加到缓冲区
            # re = trunk['choices'][0]['delta'].get('content', '')
            content = trunk.choices[0].delta.content
            re = content if content else ''
            yield re
            buffer += re

            if len(buffer) - checked_length >= INFOSEC_STREAM_BUFFER_LENGTH:
                # 检查缓冲区内容
                if safeutils.info_security_check(query=question_original,
                                                 answer=buffer,
                                                 appScene=app_sense,
                                                 username=username,
                                                 is_remittance=is_remittance)[0] is True:
                    checked_length = len(buffer)
                else:
                    yield "[UNSAFE_CONTENT]"
                    response_time = time.time() - start_time
                    result = store_question_and_answer()

                    # 使用 yield 发送 JSON 字符串，并按照流事件的格式编码
                    yield f"{json.dumps(result, ensure_ascii=False)}\n\n"
                    break
