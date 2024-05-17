<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class Play implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $room_id;
    public $publisher;
    public $media;
    public $time;

    /**
     * Create a new event instance.
     */
    public function __construct($room_id, $publisher, $media, $time)
    {
        Log::info('Play event fired!');
        $this->room_id = $room_id;
        $this->publisher = $publisher;
        $this->media = $media;
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
            new Channel('play-channel'),
        ];
    }
}
