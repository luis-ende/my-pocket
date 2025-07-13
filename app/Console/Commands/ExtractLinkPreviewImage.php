<?php

namespace App\Console\Commands;

use App\Models\Bookmark;
use App\Models\Scopes\BookmarkNotArchivedScope;
use App\Services\LinkPreviewImageExtractor;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExtractLinkPreviewImage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'my-pocket:extract-links-previews {--start-id=1} {--limit=0}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Extract links preview images of bookmarks.';

    /**
     * Execute the console command.
     */
    public function handle(LinkPreviewImageExtractor $linkPreviewImageExtractor)
    {
        $bookmarks = Bookmark::query()
            ->select('id', 'url', 'is_broken_link', 'is_archived')
            ->where(function ($query) {
                $query->where('is_broken_link', '<>', true)
                      ->orWhereNull('is_broken_link');
            })
            ->where('id', '>=', $this->option('start-id'))
            ->when($this->option('limit') > 0, function ($query) {
                $query->limit($this->option('limit'));
            })
            ->orderBy('id')
            ->withoutGlobalScope(BookmarkNotArchivedScope::class)
            ->get();

        $this->info("Extracting preview images for {$bookmarks->count()} bookmarks.");

        DB::beginTransaction();
        try {
            foreach ($bookmarks as $bookmark) {
                $this->info("Extracting url ({$bookmark->id}): {$bookmark->url}");
                $linkPreviewImageExtractor->clearContent();
                $imageUrl = $linkPreviewImageExtractor->extractPreviewImage($bookmark->url);
                $this->warn("Extracted url ({$bookmark->id}): {$imageUrl}");
                if (!empty($imageUrl)) {
                    $bookmark->clearMediaCollection('preview');
                    try {
                        $bookmark->addMediaFromUrl($imageUrl)->toMediaCollection('preview');
                    } catch (\Exception $e) {
                        $this->error("Error ({$e->getMessage()}) downloading ({$bookmark->id}): {$imageUrl}");
                    }
                    $this->warn("Downloaded image ({$bookmark->id}): {$imageUrl}");
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error processing extraction: {$e->getMessage()}");
        }
    }
}
