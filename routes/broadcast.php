<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/broadcast/pause', function(Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'media' => 'required',
        'time' => 'required|numeric',
    ]);
    event(new App\Events\Pause($request->room_id, $request->media, $request->time));
    return 'Event has been fired!';
});

Route::post('/broadcast/play', function(Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'media' => 'required',
        'time' => 'required|numeric',
    ]);
    event(new App\Events\Play($request->room_id, $request->media, $request->time));
    return 'Event has been fired!';
});

Route::post('/broadcast/end', function(Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'next_media' => 'required',
    ]);
    event(new App\Events\End($request->room_id, $request->next_media));
    return 'Event has been fired!';
});

Route::post('/broadcast/join-room', function(Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
    ]);
    event(new App\Events\JoinRoom($request->room_id));
    return 'Event has been fired!';
});

Route::post('/broadcast/playback-status', function(Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'media' => 'required',
        'state' => 'required|string',
        'time' => 'required|numeric',
    ]);
    event(new App\Events\PlaybackStatus(
        $request->room_id,
        $request->media,
        $request->state,
        $request->time));
    return 'Event has been fired!';
});
