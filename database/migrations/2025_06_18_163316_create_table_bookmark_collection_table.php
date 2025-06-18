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
        Schema::create('bookmark_collection', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bookmark_id');
            $table->unsignedBigInteger('collection_id');
            $table->timestamps();

            $table->foreign('bookmark_id')->references('id')->on('bookmarks')->onDelete('cascade');
            $table->foreign('collection_id')->references('id')->on('collections')->onDelete('cascade');;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmark_collection');
    }
};
