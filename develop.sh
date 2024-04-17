#!/bin/bash

# Not necessary as only ShouldBroadcastNow is used
# php aritsan queue:work &

php artisan reverb:start &

npm run dev &

php artisan serve
