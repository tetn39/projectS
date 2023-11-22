import sqlite3

# db.spliteを一覧で表示する

# データベースに接続する
conn = sqlite3.connect('./db.sqlite3')

# カーソルを取得する
cur = conn.cursor()

# SQL（データベースを操作するコマンド）を実行する
cur.execute('select * from sqlite_master where type="table"')

# 実行結果を取得する
for row in cur:
    print(row)

# データベースの接続を閉じる

conn.close()


