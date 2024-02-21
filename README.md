# projectS

## vs codeを起動するたびに
- `git pull` をしてgithubで更新されている内容をローカルに落とす（<- これ大事）

## git commit一連の流れ

1. `git add .` をする（すべての変更点をステージに入れる）

2. `git commit -m "コミット内容"` 「コミット内容」でコメントつけてコミットできる

3. `git push` これで実際に更新


## ブランチ(branch)
### 作成
1. [githubのレポジトリ](https://github.com/tetn39/projectS) からbranchを新しく作る。それっぽい名前を付ける

2. 作ったらvs code で`git checkout branch名`で新しく作ったbranchに移動する

3. あとは普通にコミットとかする(ただしbranch内でしか更新されない)


### マージ/プルリクエスト
作ったbranchをmainに合成する（branchでの更新内容をmainに反映する）

1. [github pullrequest](https://github.com/tetn39/projectS/pulls) からプルリクエストを作る `New pull request` 押す

2. マージするブランチを選ぶ

3. `Create pull request` 押す

4. 題名と内容を入力する

5. `Create pull request` 押す

6. ほかの人に確認してもらう。何かあったらコメントを書ける

7. `Merge pull request` と `Confirm merge` 押してmainとマージ(結合,合成)する



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
`social-auth-app-django`
`django`
`pages`
`python-dotenv`
`spotipy`
`numpy`


## ssh接続やりかた

1. teraterm をダウンロード

2. host に `melotus6.xsrv.jp`

3. TCP port に `10022`

4. OK で次に

5. User name に `melotus6`

6. Passphrase に `melotus` <- これ不要

7. Authentication methodsの Use RSA..なんたらを選択

8. `melotus6.key`フォルダを選択する(ふかまちがもってます)

9. OK で接続できる


## サーバー上でやること
1. メインで作業するフォルダに移動 `cd melodystatus.com/public_html/` 

2. 仮想環境を実行 `conda activate py310`


## パスワード系

## MySQL
xserver上でのMySQL-ID: `melotus6_admin`
password: `2023projects`
`mysql -u root -p`
`create database melotus6_musics;` 
`CREATE USER 'melotus6_admin'@'localhost' IDENTIFIED BY '2023projects';`
`GRANT ALL PRIVILEGES ON * . * TO 'melotus6_admin'@'localhost';`
`FLUSH PRIVILEGES;`


### django-admin
ID: `admin`
email: ``
password: `2023projects`



## お知らせ

ドメインとったから`melodystatus.com`で飛べるよ
