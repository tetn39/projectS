# projectS

## vs codeを起動するたびに
- `git pull` をしてgithubで更新されている内容をローカルに落とす（<- これ大事）

## git commit一連の流れ

1. `git add .` をする（すべての変更点をステージに入れる）

2. `git commit -m "コミット内容"` 「コミット内容」でコメントつけてコミットできる

3. `git push` これで実際に更新



## ブランチについてはまた後日書きます
(お楽しみに)


## サーバー起動方法

### 初回だけやること
1. `python -m venv venv`で仮想環境を作る(READMEとかの階層でする(projectSでする))

2. `venv/Scripts/activate`で仮想環境実行

3. `pip install django==4.2`をする



### いつもやること
1. `venv/Scripts/activate` をする

2. `cd projects`で１階層おり、 `python manage.py runserver`で起動

3. `http://127.0.0.1:8000/` で開ける


## pip 
`social-auth-app-django`
`django`