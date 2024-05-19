# Ngrokで外部公開する手順

## Nginx
このディレクトリに内包されているnginx.confを用いて、Nginxでサーバーを立ててください。
nginx.conf内で/path/to/から始まっているパスは環境に合わせた設定が必要です。
また、php-fpmを9000番ポートで起動しておく必要があります。

## Ngrok
```bash
$ ngrok http 7777
```

## .envを編集
このディレクトリに内包されている.env.exampleをプロジェクトのルートにコピーします。
APP_URLとREVERB_HOSTをNgrokから発行されたURLに合わせてください。
最後に.envに名前を変更します。

## .envの変更に伴うフロントエンドの変更を反映
```bash
$ npm run build
```

## Reverbサーバーを起動
```bash
$ php artisan reverb:start
```

## Nginxをリロード
この操作は必要ないかもしれません。
```bash
$ nginx -s reload
```

# 最後に
Ngrokから発行されたURLにアクセスすると、アプリケーションが表示されます。
