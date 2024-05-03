<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Item;

class RoomController extends Controller
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
        // Create new room
        $room = Room::create();

        // Create new playlist
        $room->playlist()->create(['room_id' => $room->id]);

        // Return room id as json
        return response()->json($room);
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        $init_playlist = [];
        foreach ($room->playlist->items as $playlist_item) {
            $item = Item::findOrFail($playlist_item->item_id);
            array_push($init_playlist, $item);
        }

        return Inertia::render(
            'Room',
            [
                "room_id" => $room->id,
                "playlist_id" => $room->playlist()->first()->id,
                "init_playlist" => $init_playlist,
            ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        //
    }
}
