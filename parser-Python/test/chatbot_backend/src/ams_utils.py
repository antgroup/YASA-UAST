import base64
import hashlib
import time

import requests

LINKS_APP_KEY = '658519202f769c0834470e3a'

LINKS_APP_SECRET = '730bc7195e8643a6be06e4b79ece734b'

ALIPAY_PLUS_ROOM_ID = '657a952651a53d075b8af308'

ILMSERVICE_URL = f"https://ilmservice.alipay.com/api/v1/open/flow/service"


def get_current_millis_str():
    """
    获取时间戳
    """
    current_millis = int(round(time.time() * 1000))
    # 将时间戳转换为字符串
    current_millis_str = str(current_millis)

    return current_millis_str


def get_serviceToken_md5(serviceToken, current_millis_str):
    """
        对给定的字符串进行MD5加密。

        :param value: 需要加密的字符串。
        :return: 加密后的字符串。
        """
    serviceTokenTime = serviceToken + current_millis_str

    # 创建md5对象
    md5 = hashlib.md5()
    # 对字符串进行编码
    md5.update(serviceTokenTime.encode('utf-8'))
    # 返回十六进制加密结果
    return md5.hexdigest()


def decode_base64(input_str):
    """
    解码Base64编码的字符串
    """
    try:
        if 'ac_' in input_str:
            input_str = input_str.split('ac_')[1]
        # 尝试Base64解码，可能会抛出异常
        decoded_bytes = base64.b64decode(input_str, validate=True)
        # 尝试将解码后的字节序列转换为UTF-8字符串
        try:
            decoded_str = decoded_bytes.decode('utf-8')
            return decoded_str
        except UnicodeDecodeError:
            # 如果字节序列不能被转换为UTF-8字符串，返回原始输入字符串
            return input_str
    except (base64.binascii.Error, ValueError):
        # 解码失败，返回原始输入字符串
        return input_str


def composeLinksUrl(username, email):
    """
    组装转人工地址
    """
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "LinksAuthToken": build_links_auth_token(LINKS_APP_KEY, LINKS_APP_SECRET)
    }
    url = f"https://links-openapi.alipay.com/openapi/room/{ALIPAY_PLUS_ROOM_ID}/token/create"
    body = {
        "userId": username,
        "userName": email,
        "accountSystem": "ANTOM",
        "roomId": ALIPAY_PLUS_ROOM_ID
    }

    response = requests.post(url, headers=headers, json=body)
    token = response.json().get("result")

    url = "https://links-tp.alipay.com/app/room/657a952651a53d075b8af308/start-conversation-form/?links_auth_token=" + token

    linksUrl = "人工地址: " + "<a href=\"" + url + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + url + "<a>"

    return linksUrl


def build_links_auth_token(links_appkey, links_appsecret):
    """
    links验证token
    """
    rets = ""
    try:
        timestamp = str(int(time.time() * 1000))
        sign = links_appkey + timestamp + links_appsecret
        md5 = hashlib.md5()
        md5.update(sign.encode(encoding='UTF-8'))
        signed = md5.hexdigest().lower()
        rets = links_appkey + "." + timestamp + "." + signed
    except:
        print("links_auth_token failed.")
    return rets


def compose_ilmservice_headers():
    """
    构建ilmservice请求头
    """
    serviceToken = 'd2e53bc2dd8cae4ab1d9ae389c5d715c'

    current_millis_str = get_current_millis_str()

    md5hash = get_serviceToken_md5(serviceToken, current_millis_str)

    ilmservice_headers = {
        'Content-Type': 'application/json',
        'X-DEPLOY-APP': 'iexpmhome',
        'X-DEPLOY-TOKEN': md5hash,
        'X-DEPLOY-TIMESTAMP': current_millis_str,
    }

    return ilmservice_headers


def compose_rewards_headers():
    """
    构建ilmservice请求头
    """
    serviceToken = '8c5faaa94f2077863a2b34b3e64ebf2e'

    current_millis_str = get_current_millis_str()

    md5hash = get_serviceToken_md5(serviceToken, current_millis_str)

    ilmservice_headers = {
        'Content-Type': 'application/json',
        'X-DEPLOY-APP': 'icontentcenter',
        'X-DEPLOY-TOKEN': md5hash,
        'X-DEPLOY-TIMESTAMP': current_millis_str,
    }

    return ilmservice_headers


def compose_ilmservice_request(question, userId, sessionId):
    """
    构建ilmservice请求体
    """
    serviceId = '8610937568319490650'
    ilmservice_request_body = {
        "serviceId": serviceId,
        "sessionId": sessionId,
        "stream": True,
        "message": [
            {
                "role": "user",
                "content": question
            }
        ],
        "customRequest": {},
        "sessionOwnerId": 'doc_' + userId
    }

    return ilmservice_request_body


def compose_rewards_request(question, userId, sessionId):
    """
    构建ilmservice请求体
    """
    serviceId = '8610937571288031724'
    ilmservice_request_body = {
        "serviceId": serviceId,
        "sessionId": sessionId,
        "stream": True,
        "message": [
            {
                "role": "user",
                "content": question
            }
        ],
        "customRequest": {
            "pspId": '1022160000000000000'
        },
        "sessionOwnerId": '2108220001065955'
    }

    return ilmservice_request_body


def compose_gpa_campaign_ilmservice_headers():
    """
    构建ilmservice请求头
    """
    serviceToken = 'd2e53bc2dd8cae4ab1d9ae389c5d715c'

    current_millis_str = get_current_millis_str()

    md5hash = get_serviceToken_md5(serviceToken, current_millis_str)

    gpa_campaign_ilmservice_headers = {
        'Content-Type': 'application/json',
        'X-DEPLOY-APP': 'iexpmhome',
        'X-DEPLOY-TOKEN': md5hash,
        'X-DEPLOY-TIMESTAMP': current_millis_str,
    }

    return gpa_campaign_ilmservice_headers


def compose_gpa_campaign_ilmservice_request(question, userId, sessionId):
    """
    构建ilmservice请求体
    """
    serviceId = '8610937571596227880'
    gpa_campaign_ilmservice_request = {
        "serviceId": serviceId,
        "sessionId": sessionId,
        "stream": True,
        "message": [
            {
                "role": "user",
                "content": question
            }
        ],
        "customRequest": {},
        "sessionOwnerId": 'gpa_' + userId
    }

    return gpa_campaign_ilmservice_request

