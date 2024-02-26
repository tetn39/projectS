# projectS

## サーバー起動方法

### 初回だけやること
1. `python -3.10 -m venv venv`で仮想環境を作る(READMEとかの階層でする(projectSでする))

2. `venv/Scripts/activate`で仮想環境実行

3. `pip install django==4.2`をする

### いつもやること
1. `venv/Scripts/activate` をする

2. `cd projects`で１階層おり、 `python manage.py runserver`で起動

3. `http://127.0.0.1:8000/` で開ける

4. `deactivate`で抜ける

## pip 
- `social-auth-app-django`
- `django`
- `pages`
- `python-dotenv`
- `spotipy`
- `numpy`
- `pymysql`
