<?php

namespace App\Jobs;

use App\Models\Bookmark;
use App\Services\LinkUrlCheckService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProcessBrokenLinks implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected LinkUrlCheckService $linkUrlCheckService,
        protected Collection $bookmarks
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $brokenLinks = [];
            foreach ($this->bookmarks as $bookmark) {
                Log::info("Checking url ({$bookmark->id}): {$bookmark->url}");
                if ($this->linkUrlCheckService->isLinkBroken($bookmark->url)) {
                    $brokenLinks[] = $bookmark->id;
                    Log::warning("Broken link ({$bookmark->id}): {$bookmark->url}");
                }
            }

            if (! empty($brokenLinks)) {
                Bookmark::whereIn('id', $brokenLinks)
                    ->update([
                        'is_broken_link' => true,
                        'is_archived' => true,
                    ]);
                Cache::put('check_broken_links_last_id', $this->bookmarks->last()->id);
            }

            Log::info('Broken links checking process completed.');
        } catch (\Throwable $e) {
            Log::error('Broken links checking process failed: '.$e->getMessage());
            throw $e;
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::error('Job ProcessBrokenLinks permanently failed: '.$exception->getMessage());
    }
}
