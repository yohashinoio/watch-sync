<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('provider');
            $table->string('media_id');
        });

        Schema::create('playlist_items', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('playlist_id')->constrained('playlists')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('items');
            $table->unique(['playlist_id', 'item_id']);
        });

        Schema::create('playlists', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('playlists');
        Schema::dropIfExists('playlist_items');
        Schema::dropIfExists('items');
    }
};
