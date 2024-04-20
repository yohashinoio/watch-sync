<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    public function playlistItem()
    {
        return $this->belongsTo(PlaylistItem::class);
    }
}
