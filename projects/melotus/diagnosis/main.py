import sqlite3
from django.conf import settings

def get_status(uris):
    
    con = sqlite3.connect(f'{settings.BASE_DIR}/db/db.sqlite3')
    cur = con.cursor()

    cur.execute('SELECT * FROM ')

    con.close()
    pass



json = {
   "uris": [
       "7IQiZVGgfW927fImwKJDOq",
       "0MyTMrPTh0GgtuyhYRdl3P",
       "1Sy41HCCozDBL73orZpW5Y",
       "2ChSAhdQmJpHgos2DQP6cI"
       ] 
}

print(get_status(json))