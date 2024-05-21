FROM composer:2.3.10 as composer

RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install pcntl
RUN docker-php-ext-configure pcntl --enable-pcntl

WORKDIR /watch-sync
CMD ["php", "artisan", "reverb:start"]
