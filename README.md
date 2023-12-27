# これはなんですか
Webサービス開発の学習用連絡帳サービスです。

# 動作環境
- Node.js（v20以上推奨）
- PostgreSQL（v11以上推奨）

# 設定
環境によってconfig/config.jsonに修正が必要な場合があります。必要に応じてusername、passwordの項目を入力してください。

```json
{
  "development": {
    "username": [ユーザ名],
    "password": [パスワード],
    "database": "jscontacts_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```
 
# 起動するには

```
$ npm install
$ npx sequelize-cli db:create
$ npx sequelize-cli db:migrate
$ DEBUG=jscontacts:* npm start

access http://localhost:3000
```
