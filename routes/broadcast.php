<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/broadcast/pause', function(Request $request) {
    $request->validate([
        'media' => 'required',
        'time' => 'required|numeric',
    ]);
    event(new App\Events\Pause($request->media, $request->time));
    return 'Event has been fired!';
});

Route::post('/broadcast/play', function(Request $request) {
    $request->validate([
        'media' => 'required',
        'time' => 'required|numeric',
    ]);
    event(new App\Events\Play($request->media, $request->time));
    return 'Event has been fired!';
});
