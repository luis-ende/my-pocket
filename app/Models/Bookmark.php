<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Bookmark extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'url',
        'tags',
        'checked',
        'is_fav'
    ];

    protected $appends = [
        'preview_image_url',
    ];

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class);
    }

    protected function previewImageUrl(): Attribute
    {
        return new Attribute(
            get: fn () => $this->getFirstMediaUrl('preview')
        );
    }
}
