<?php

namespace App\Models;

use App\Models\Scopes\BookmarkNotArchivedScope;
use App\Services\LinkPreviewImageExtractor;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Log;
use Laravel\Scout\Attributes\SearchUsingFullText;
use Laravel\Scout\Attributes\SearchUsingPrefix;
use Laravel\Scout\Searchable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

#[ScopedBy([BookmarkNotArchivedScope::class])]
class Bookmark extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, Searchable;

    protected $fillable = [
        'title',
        'url',
        'tags',
        'checked',
        'is_fav',
    ];

    protected $hidden = [
        'media',
    ];

    protected $appends = [
        'preview_image_url',
        'url_host',
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
            get: fn () => $this->getFirstMedia('preview')
                ?->getUrl('thumb-cropped'),
        );
    }

    protected function urlHost(): Attribute
    {
        return new Attribute(
            get: fn () => preg_replace('/^www\./i', '', parse_url($this->url, PHP_URL_HOST)),
        );
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb-cropped')
            ->nonOptimized()
            ->performOnCollections('preview')
            ->nonQueued();
    }

    public function savePreviewImage(LinkPreviewImageExtractor $linkPreviewImageExtractor): void
    {
        try {
            $imageUrl = $linkPreviewImageExtractor->extractPreviewImage($this->url);
            if (! empty($imageUrl)) {
                $this->addMediaFromUrl($imageUrl)->toMediaCollection('preview');
            }
        } catch (\Throwable $e) {
            Log::error("Fetch bookmark ({$this->url}) preview image failed with message: {$e->getMessage()}");
        }
    }
}
