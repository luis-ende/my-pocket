<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the bookmarks in the collection.
     */
    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(Bookmark::class);
    }
}
