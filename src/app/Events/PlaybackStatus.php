<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

// An event to share the media currently being played for newcomers to a room
class PlaybackStatus implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $room_id;
    public $for;
    public $media;
    public $state;
    public $time;

    /**
     * Create a new event instance.
     */
    public function __construct($room_id, $for, $media, $state, $time)
    {
        Log::info('Playback status event fired!');
        $this->room_id = $room_id;
        $this->for = $for;
        $this->media = $media;
        $this->state = $state;
        $this->time = $time;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('playback-status-channel'),
        ];
    }
}
