<?php

namespace App\Jobs;

use App\Models\Bookmark;
use App\Services\LinkPreviewImageExtractor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessBookmarkCoverImage implements ShouldQueue
{
    use Queueable;

    private readonly LinkPreviewImageExtractor $linkPreviewImageExtractor;

    /**
     * Create a new job instance.
     */
    public function __construct(public Bookmark $bookmark)
    {
        $this->linkPreviewImageExtractor = app()->make(LinkPreviewImageExtractor::class);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $imageUrl = $this->linkPreviewImageExtractor->extractPreviewImage($this->bookmark->url);
        if (! empty($imageUrl)) {
            $this->bookmark
                ->addMediaFromUrl($imageUrl)
                ->toMediaCollection('preview');
        }
    }
}
