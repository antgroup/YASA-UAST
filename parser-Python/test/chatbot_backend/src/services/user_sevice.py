from werkzeug.security import generate_password_hash, check_password_hash
from src.db_pool import pool
from flask import current_app as app

class UserService:
    @staticmethod
    def verify_user_password(username: str, password: str):
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute('select user_name, pwd, email from user where user_name = %s', [username])
            record = cur.fetchone()
            if not record:
                return False, None
            else:
                if check_password_hash(record[1], password):
                    return True, record[2]
                else:
                    return False, None
        except Exception as e:
            app.logger.error(f"An error occurred when verify_user_password for login: {e}")
            return False, None
        finally:
            con.close()

    @staticmethod
    def create_user(username, password, email):
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute('insert into user(user_name, pwd, email) values(%s, %s, %s)', [username, generate_password_hash(password), email])
            app.logger.info("user created.")
            con.commit()
        except Exception as e:
            app.logger.error(f"An error occurred when create_user for login: {e}")
        finally:
            con.close()
        pass
    
     
    @staticmethod
    def update_user_encrypt_password(username, password, email):
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            # 获取数据库连接
            con = pool.get_connection()
            # 获取游标
            cur = con.cursor()
            # 执行更新密码的SQL语句
            cur.execute('update user set pwd=%s where user_name=%s and email=%s', [generate_password_hash(password), username, email])
            # 打印提示信息
            app.logger.info("user password updated.")
            # 提交事务
            con.commit()
        except Exception as e:
            app.logger.error(f"An error occurred when update_user_encrypt_password for login: {e}")
        finally:
            # 关闭数据库连接
            con.close()
        # 传递
        pass
    
    @staticmethod
    def get_userlist_for_update_password():
        app.logger.info(f"used_connection:{pool.get_used_connection_count()}")
        try:
            con = pool.get_connection()
            cur = con.cursor()
            cur.execute("select user_name, pwd, email from user where pwd is not null and pwd not like 'scrypt:%' and user_name is not null and email is not null")
            records = cur.fetchall()
            return records
        except Exception as e:
            app.logger.error(f"An error occurred when get_userlist_for_update_password for login: {e}")
            return None
        finally:
            con.close()
