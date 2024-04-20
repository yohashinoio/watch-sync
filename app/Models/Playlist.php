<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Playlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
    ];

    public function items()
    {
        return $this->hasMany(PlaylistItem::class);
    }
}
