<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class PlaylistItem extends Model
{
    protected $fillable = [
        'playlist_id',
        'item_id',
    ];

    public function playlist(): BelongsTo
    {
        return $this->belongsTo(Playlist::class);
    }

    public function item(): HasOne
    {
        return $this->hasOne(Item::class);
    }
}
