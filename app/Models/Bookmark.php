<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
    protected $fillable = [
        'title',
        'url',
        'tags',
        'checked',
        'is_fav'
    ];
}
