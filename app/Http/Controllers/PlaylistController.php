<?php

namespace App\Http\Controllers;

use App\Models\Playlist;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Item;
use App\Events\UpdatePlaylist;

class PlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Playlist $playlist)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Playlist $playlist)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Playlist $playlist)
    {
        $request->validate([
            'new_playlist' => 'present',
        ]);

        // Delete all items from the previous playlist
        $playlist->items()->delete();

        $items = [];

        foreach ($request->new_playlist as $item) {
            array_push($items, Item::firstOrCreate([
                'provider' => $item['provider'],
                'media_id' => $item['id'],
            ]));
        }

        foreach ($items as $item) {
            $playlist_item = $playlist->items()->create([
                'playlist_id' => $playlist->id,
                'item_id' => $item->id,
            ]);
        }

        UpdatePlaylist::dispatch($playlist->id, $items);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Playlist $playlist)
    {
        //
    }
}
