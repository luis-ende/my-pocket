<?php

namespace App\Console\Commands;

use App\Models\Bookmark;
use App\Services\LinkUrlCheckService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckBrokenLinks extends Command
{
    protected $signature = 'my-pocket:check-broken-links';

    protected $description = 'Check and update bookmarks with broken links.';

    public function handle(LinkUrlCheckService $linkUrlCheckService)
    {
        DB::beginTransaction();
        try {
            DB::table('bookmarks')->update([
                'is_broken_link' => false,
            ]);

            Bookmark::query()->select('id', 'url')
                ->chunk(500, function ($bookmarks) use ($linkUrlCheckService) {
                    $brokenLinks = [];
                    foreach ($bookmarks as $bookmark) {
                        $this->info("Checking url ({$bookmark->id}): {$bookmark->url}");
                        if ($linkUrlCheckService->isLinkBroken($bookmark->url)) {
                            $brokenLinks[] = $bookmark->id;
                            $this->warn("Broken link ({$bookmark->id}): {$bookmark->url}");
                        }
                    }

                    if (!empty($brokenLinks)) {
                        Bookmark::whereIn('id', $brokenLinks)
                            ->update([
                                'is_broken_link' => true,
                            ]);
                    }
                });

            DB::commit();
        } catch (\Exception $e) {
            $this->error($e->getMessage());
            DB::rollBack();
        }
    }
}
