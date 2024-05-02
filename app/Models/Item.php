<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = [
        'provider',
        'media_id',
    ];

    public function playlistItem()
    {
        return $this->belongsTo(PlaylistItem::class);
    }
}
