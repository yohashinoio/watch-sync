#!/bin/bash

# php aritsan queue:work &
php artisan reverb:start &

npm run dev &

php artisan serve
