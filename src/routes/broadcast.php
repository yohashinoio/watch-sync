<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/broadcast/pause', function (Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'publisher' => 'required',
        'media' => 'required',
        'time' => 'required|numeric',
    ]);

    event(new App\Events\Pause($request->room_id, $request->publisher, $request->media, $request->time));

    return 'Event has been fired!';
});

Route::post('/broadcast/play', function (Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'publisher' => 'required',
        'media' => 'required',
        'time' => 'required|numeric',
    ]);

    event(new App\Events\Play($request->room_id, $request->publisher, $request->media, $request->time));

    return 'Event has been fired!';
});

Route::post('/broadcast/end', function (Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'publisher' => 'required',
        'next_media' => 'required',
    ]);

    event(new App\Events\End($request->room_id, $request->publisher, $request->next_media));

    return 'Event has been fired!';
});

Route::post('/broadcast/join-room', function (Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'joined_user' => 'required',
    ]);

    event(new App\Events\JoinRoom($request->room_id, $request->joined_user));

    return 'Event has been fired!';
});

Route::post('/broadcast/playback-status', function (Request $request) {
    $request->validate([
        'room_id' => 'required|integer',
        'for' => 'required',
        'media' => 'required',
        'state' => 'required|string',
        'time' => 'required|numeric',
    ]);

    event(new App\Events\PlaybackStatus(
        $request->room_id,
        $request->for,
        $request->media,
        $request->state,
        $request->time));

    return 'Event has been fired!';
});
