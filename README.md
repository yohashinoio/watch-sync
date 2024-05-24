# Status of support
- [x] YouTube
- [ ] Spotify
- [ ] Twitch
- [ ] SoundCloud

# How to try?

## Initial settings
```bash
$ cd src
$ composer i
$ npm i
$ cp .env.try.example .env
$ php artisan key:generate
```

## Ngrok
If you just want to try it out alone, **you can skip this section**.

If not, and you want to use this app with people from an outside network, you will need to expose it to the outside world in some way.<br>
However, preparing a server is not easy, so we will use Ngrok here.

Please complete the installation and login of Ngrok by referring to another article and so on.

### Connect
```bash
$ ngrok http 8000
```
### Edit environment variables
```
APP_ENV=ngrok

APP_URL=https://example.ngrok.com # Generated URL
VITE_REVERB_HOST=example.ngrok.com

VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

## Setting environment variables
### Reverb
If you just want to try this application, it is enough to set `REVERB_APP_ID`, `REVERB_APP_KEY`, and `REVERB_APP_SECRET`.

#### REVERB_APP_ID
```bash
$ tr -dc 0-9 < /dev/urandom | fold -w 8 | head -1
```

#### REVERB_APP_KEY and REVERB_APP_SECRET
```bash
$ tr -dc "[:alnum:]" < /dev/urandom | fold -w 20 | head -2
```

Write the generated values in the appropriate places in the `.env` and that's it.

### MySQL
If you just want to try this app, just set `DB_PASSWORD` to `root` in `.env`.
```
DB_PASSWORD=root
```

Of course, if the operating requirements are such that security is important, strict configuration is necessary.
In that case, change `MYSQL_ROOT_PASSWORD` in `compose.yaml`.

## Build frontend
```bash
$ npm run build
 ```

## Start up containers
```bash
$ docker compose up -d
```
### Change permissions
```bash
$ sudo chown -R :www-data .
$ sudo chmod -R 775 storage
```

## Migrate
```bash
$ docker compose exec php php /var/www/html/watch-sync/artisan migrate
```

## Finally
Those who have done the Ngrok section should visit the Ngrok URL, and those who have not should visit `localhost:8000` from a web browser.

<div id="SEVREVERB">



<div id="SEVMYSQL">
