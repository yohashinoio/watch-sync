<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/broadcast/end', function() {
    event(new App\Events\End());
    return 'Event has been fired!';
});

Route::post('/broadcast/pause', function(Request $request) {
    event(new App\Events\Pause($request->time));
    return 'Event has been fired!';
});

Route::post('/broadcast/play', function(Request $request) {
    event(new App\Events\Play($request->time));
    return 'Event has been fired!';
});
