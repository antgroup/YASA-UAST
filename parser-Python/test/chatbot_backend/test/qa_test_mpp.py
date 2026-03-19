from time import sleep

import requests
import json
import mysql.connector
import os
from dotenv import load_dotenv
from transformers import logging

# 加载环境变量 要保证项目的根目录下有对应的.env 且.env文件中配置了单元测试需要的数据信息
load_dotenv()

logging.set_verbosity_error()
os.environ["TOKENIZERS_PARALLELISM"] = "false"

# 从环境变量中读取数据库和其他敏感信息
mydb = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    password=os.getenv('MYSQL_PASSWORD'),
    database="chatbot",
    charset="utf8mb4"
)
token = os.getenv('TOKEN_FOR_UNIT_TEST')
url = os.getenv('API_URL_FOR_UNIT_TEST')
role = "MPP"
# role = "ACQP"

compareUrl = os.getenv('COMPARE_URL_FOR_UNIT_TEST')
query = 'select id'
progress = 0


def test():
    chatid = 110200 + progress
    insert_sql = "INSERT INTO automate_test_log (chat_id, question_id, sa_ans, docai_ans, similarity, role, version) VALUES (%s, %s, %s, %s, %s, %s, %s)"

    mycursor = mydb.cursor()
    mycursor.execute(f"Select * from automate_test_question_list_fix where role = '{role}'")

    questionlist = mycursor.fetchall()

    mycursor.execute(
        f"select version from knowledge_base_temp2 where role = '{role}' group by version order by version")
    versionlist = mycursor.fetchall()

    for version in versionlist:
        # print(version[0])
        for i in range(len(questionlist)):
            print(f'({i + 1}/{len(questionlist)}) {questionlist[i][1]}')
            # if version[0] in ['1.0.0', '1.1.1', '1.1.2', '1.2.0', '1.2.1', '1.3.0', '1.4.0', '1.4.1']:
            # if version[0] != '1.3.3':
            if version[0] != '1.4.1':
                continue

            if i < progress:
                continue

            # if version[0] in ['1.4.0']:
            #     if question[0] <= 484:
            #         continue

            headers = {"Content-type": "application/json", "token": token.strip()}
            data = {
                "question": questionlist[i][1],
                "chat_id": chatid,
                "role": role,
                "version": version[0],
            }

            while True:
                try:
                    response = requests.post(url, headers=headers, json=data)
                    response_dict = json.loads(response.text)
                    print(response_dict)
                    docai_ans = response_dict['answer']
                except Exception as e:
                    print(f'机器人调用失败：{e}')
                    sleep(3)
                else:
                    break

            # model2=sentence_similarity(model_name='distilbert-base-uncased',embedding_type='sentence_embedding')
            # similarity = model2.get_score(question[2],docai_ans,metric="cosine")

            data = {
                "content1": questionlist[i][2],
                "content2": docai_ans
            }
            headers = {"token": token.strip()}
            while True:
                try:
                    response = requests.post(compareUrl, headers=headers, json=data)
                    similarity = response.json()['similarity']
                except Exception as e:
                    print(f'相似度接口调用失败：{e}')
                    sleep(3)
                else:
                    break

            # similarity = get_cosine(question[2], docai_ans)
            val = (chatid, questionlist[i][0], questionlist[i][2], docai_ans, similarity, role, version[0])
            mycursor.execute(insert_sql, val)
            mydb.commit()
            chatid = chatid + 1

        print(mycursor.rowcount, "was inserted.")


## 0.82 and above consider it is correct

# resultlist = []

# for line in lines:
#     headers = {"Content-type": "application/json", "token": token.strip()}
#     data = {
#         "question": line.strip() ,
#         "chat_id": chatid,
#         "role": "MPP",
#         "version": "1.3.0",
#     }
#     print(data)

#     response = requests.post(url, headers=headers, json=data)
#     response_dict = json.loads(response.text)
#     try:
#     # Your code goes here
#         chat_id = response_dict['chat_id']
#         resultlist.append(chat_id)
#         chatid = chatid + 1
#     except Exception as e:
#         print(f"An error occurred: {e}")


#     print(response.status_code)
#     print(response.json())


# np.array(resultlist).tofile('MPP_LIST_ANS.txt', sep=',')


def get_accuracy(chat_ids):
    query = \
        f"""
        SELECT SUM(CASE WHEN similarity >= 0.90 THEN 1 ELSE 0 END) / COUNT(*) as accuracy
        FROM automate_test_log
        WHERE role = 'MPP' AND version = '1.4.1' and chat_id BETWEEN {chat_ids[0]} and {chat_ids[1]}
        """

    cur = mydb.cursor()
    cur.execute(query)
    accuracy = cur.fetchone()[0]
    return accuracy


if __name__ == '__main__':
    test()
    # print(get_accuracy([100200, 100378]))
