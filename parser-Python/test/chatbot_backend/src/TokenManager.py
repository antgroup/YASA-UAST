import os
from datetime import datetime, timedelta
from functools import wraps

import jwt
from dotenv import load_dotenv
from flask import request, jsonify, current_app as app

# 加载环境变量
load_dotenv()

class TokenManager:
    """
    用于生成、验证和管理JWT令牌的类。
    
    Attributes:
        SECRET (str): 从环境变量中获取的密钥，用于编码和解码JWT。
        ALGORITHM (str): 用于JWT编码/解码的算法。
        EXPIRATION_MINUTES (int): 令牌的有效期（以分钟为单位）。
    """
    # 从环境变量中获取密钥
    SECRET = os.getenv("SECRET")
    # 使用HS256算法
    ALGORITHM = 'HS256'
    # 令牌有效期为1天（1440分钟）
    EXPIRATION_MINUTES = 1440

    @staticmethod
    def generate_token(username: str, email: str) -> str:
        """
        生成一个JWT令牌并返回。

        Args:
            username (str): 用户名。
            email (str): 用户邮箱地址。

        Returns:
            str: 生成的JWT令牌。
        """
        # 构建payload，包含用户名、邮箱以及过期时间
        payload = {
            'username': username,
            'email': email,
            'exp': datetime.utcnow() + timedelta(minutes=TokenManager.EXPIRATION_MINUTES)
        }
        # 使用指定的密钥和算法生成JWT
        token = jwt.encode(payload, TokenManager.SECRET, algorithm=TokenManager.ALGORITHM)
        app.logger.info(f"Access token generated for user: {username}")
        return token

    @staticmethod
    def validate_token(token: str) -> dict:
        """
        验证给定的JWT令牌是否有效，并返回相应的信息。

        Args:
            token (str): 要验证的JWT令牌。

        Returns:
            dict: 包含验证结果、用户名和邮箱的字典。
                如果令牌无效或已过期，则返回错误信息。
        """
        try:
            # 解码JWT令牌
            decoded = jwt.decode(token, TokenManager.SECRET, algorithms=[TokenManager.ALGORITHM])
            # 检查令牌是否已经过期
            if decoded['exp'] < datetime.utcnow().timestamp():
                return {'result_code': 'F', 'message': "Token expired"}
            # 返回用户名和邮箱
            return {'result_code': 'S', 'username': decoded["username"], 'email': decoded["email"]}
        except jwt.ExpiredSignatureError:
            app.logger.error("Token has expired.")
            return {'result_code': 'F', 'message': "Token expired"}
        except jwt.InvalidTokenError as e:
            app.logger.error(f"Invalid token: {str(e)}")
            return {'result_code': 'F', 'message': "Invalid token"}
        except Exception as e:
            # 如果解码过程中发生异常，返回错误信息
            app.logger.error(f"Error in token validation: {str(e)}")
            return {'result_code': 'F', 'message': 'Unknown Exception'}

    @staticmethod
    def get_feedback_token() -> str:
        """
        从环境变量中获取用于反馈的令牌，用于调用其他系统。

        Returns:
            str: 用于反馈的令牌。
        """
        # 从环境变量中获取令牌
        return os.getenv("TOKEN_FOR_FEEDBACK")


# check the session token is valid or not
def require_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("token")
        result = TokenManager.validate_token(token)
        if result['result_code'] != 'S':
            app.logger.info(result)
            return jsonify(result), 403
        kwargs['username'] = result['username']
        kwargs['email'] = result['email']
        return f(*args, **kwargs)

    return decorated_function