<?php

namespace App\Jobs;

use App\Models\Bookmark;
use App\Services\LinkPreviewImageExtractor;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Attributes\WithoutRelations;

class ProcessBookmarkCoverImage implements ShouldQueue
{
    use Queueable;

    /**
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 11;

    /**
     * Indicate if the job should be marked as failed on timeout.
     *
     * @var bool
     */
    public $failOnTimeout = true;

    /**
     * Create a new job instance.
     */
    public function __construct(
        #[WithoutRelations]
        public Bookmark $bookmark
    ) {}

    /**
     * Execute the job.
     */
    public function handle(LinkPreviewImageExtractor $linkPreviewImageExtractor): void
    {
        $imageUrl = $linkPreviewImageExtractor->extractPreviewImage($this->bookmark->url);
        if (! empty($imageUrl)) {
            $this->bookmark
                ->addMediaFromUrl($imageUrl)
                ->toMediaCollection('preview');
        }
    }
}
