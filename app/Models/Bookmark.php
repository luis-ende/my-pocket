<?php

namespace App\Models;

use App\Models\Scopes\BookmarkNotArchivedScope;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([BookmarkNotArchivedScope::class])]
class Bookmark extends Model implements HasMedia
{
    use InteractsWithMedia, Searchable;

    protected $fillable = [
        'title',
        'url',
        'tags',
        'checked',
        'is_fav'
    ];

    protected $hidden = [
        'media',
    ];

    protected $appends = [
        'preview_image_url',
    ];

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class);
    }

    /**

     * Get the indexable data array for the model.

     *

     * @return array<string, mixed>

     */

    #[SearchUsingPrefix(['url'])]
    #[SearchUsingFullText(['title'])]
    public function toSearchableArray(): array

    {
        return [
            'title' => $this->title,
            'url' => $this->url,
        ];

    }

    protected function previewImageUrl(): Attribute
    {
        return new Attribute(
            get: fn () => $this->getFirstMediaUrl('preview')
        );
    }
}
