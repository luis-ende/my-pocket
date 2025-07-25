<?php

namespace App\Console\Commands;

use App\Jobs\ProcessBrokenLinks;
use App\Models\Bookmark;
use App\Services\LinkUrlCheckService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class CheckBrokenLinks extends Command
{
    protected $signature = 'my-pocket:check-broken-links {--start-id}';

    protected $description = 'Check and update bookmarks with broken links.';

    public function handle(LinkUrlCheckService $linkUrlCheckService)
    {
        $this->info('Sending broken links checking process to queue...');
        $lastId = $this->option('start-id') ?
            $this->option('start-id') : Cache::get('check_broken_links_last_id');
        $this->info('Starting from bookmark id: '.$lastId);
        Bookmark::query()->select('id', 'url')
            ->where('id', '>', $lastId)
            ->orderBy('id')
            ->chunk(1000, function ($bookmarks) use ($linkUrlCheckService) {
                ProcessBrokenLinks::dispatch($linkUrlCheckService, $bookmarks);
            });

        $this->info('Broken links checking process was sent to queue.');
    }
}
