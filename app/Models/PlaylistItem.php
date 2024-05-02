<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaylistItem extends Model
{
    protected $fillable = [
        'playlist_id',
        'item_id',
    ];

    public function playlist()
    {
        return $this->belongsTo(Playlist::class);
    }

    public function item()
    {
        return $this->hasOne(Item::class);
    }
}
