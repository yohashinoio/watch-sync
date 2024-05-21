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
        // Create new room
        $room = Room::create();

        // Create new playlist
        $room->playlist()->create(['room_id' => $room->id]);

        return redirect()->route("rooms.show", ["room" => $room->id]);
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
    public function show(Room $room)
    {
        $user = auth()->user();

        $init_playlist = [];
        foreach ($room->playlist->items as $playlist_item) {
            $item = Item::findOrFail($playlist_item->item_id);
            array_push($init_playlist, $item);
        }

        $room->users()->syncWithoutDetaching($user);

        return Inertia::render(
            "Room",
            [
                "room_id" => $room->id,
                "playlist_id" => $room->playlist()->first()->id,
                "init_playlist" => $init_playlist,
                "init_viewers" => $room->users,
            ]
        );
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
