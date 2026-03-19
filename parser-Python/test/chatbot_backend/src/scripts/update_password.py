from src.services.user_sevice import UserService


def update_encrypted_password():
    """
    Update the encrypted password in the database
    """
    # get user list
    users = UserService.get_userlist_for_update_password()
    print(users)
    if len(users) > 0:
        for user in users:
            print(user)
            if user[1].startswith('scrypt:'):
                print("no need to update password for user: %s" % user[0])
                continue
            else:
                # encrypt password
                UserService.update_user_encrypt_password(user[0], user[1], user[2])
                print(user[1])
            # update encrypted password
            # UserService.update_encrypted_password(user.id, user.password)
        pass
    pass

update_encrypted_password()