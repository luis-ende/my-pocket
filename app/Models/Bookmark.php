<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Bookmark extends Model
{
    protected $fillable = [
        'title',
        'url',
        'tags',
        'checked',
        'is_fav'
    ];

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class);
    }
}
