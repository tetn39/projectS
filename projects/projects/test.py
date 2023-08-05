import sqlite3

def print_table_contents(connection):
    cursor = connection.cursor()
    # cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    # tables = cursor.fetchall()

    # for table in tables:
    #     table_name = table[0]
    #     print(f"Table: {table_name}")
    #     cursor.execute(f"SELECT * FROM {table_name};")
    #     rows = cursor.fetchall()
    #     for row in rows:
    #         print(row)
    #     print()
    
    cursor.execute("PRAGMA table_info(social_auth_usersocialauth);")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    print()
    cursor.execute("SELECT * FROM social_auth_usersocialauth;")
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    print()

if __name__ == "__main__":
    db_path = "./projects/db.sqlite3"  # あなたのSQLite3データベースファイルへのパスを指定します
    connection = sqlite3.connect(db_path)
    print_table_contents(connection)
    connection.close()






"""
(0, 'id', 'integer', 1, None, 1)
(1, 'provider', 'varchar(32)', 1, None, 0)
(2, 'uid', 'varchar(255)', 1, None, 0)
(3, 'extra_data', 'text', 1, None, 0)
(4, 'user_id', 'integer', 1, None, 0)
(5, 'created', 'datetime', 1, None, 0)
(6, 'modified', 'datetime', 1, None, 0)

(1, 'spotify', '3143y5wvzitku4fmcwfi5hleekty', '{"auth_time": 1690875249, "refresh_token": "AQAdlF9lpS0gmdhcIcV5WcRfZ5Re0GnoirsXHY77kJW7aU0CdI3tMZ3btkDNCisdkGfR7TQCBKCOcet2L_Gga7DC8NWhGOnRhFy2zEPRayOOBns6W78SAT3xwAuDOZO-GGo", "access_token": "BQDoRA-uLM6HXmsQmQzkj8Z5Vv10QCMx8B-acIHwYDOLuzRjIPFBiB9Yz1e8vtox9d-ZzZyjpvBHzWeFChqhvziS0zSxJkCq46APtnI9Fh13OI9cJRR9iGL9F_zBqTtMzNc2i05rhGGapadQhqXnnOwLEbNV_rzWv5UUK4-8YhpVQ2_cb7372qzWeSdmP2UlRmnrsRJUgwzl1Xr0Przyd8l9gZq4KBHSmDPI", "token_type": "Bearer"}', 1, '2023-07-30 10:51:04.467481', '2023-08-01 07:34:09.875879')
"""