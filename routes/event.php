<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/end', function() {
    event(new App\Events\End());
    return 'Event has been fired!';
});

Route::post('/pause', function(Request $request) {
    event(new App\Events\Pause($request->time));
    return 'Event has been fired!';
});

Route::post('/play', function(Request $request) {
    event(new App\Events\Play($request->time));
    return 'Event has been fired!';
});
