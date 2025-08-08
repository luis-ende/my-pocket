<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Collection;
use App\Models\Scopes\BookmarkNotArchivedScope;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::query()
            ->where('checked', false)
            ->latest()
            ->cursorPaginate(8);

        return Inertia::render('dashboard', [
            'bookmarks' => $bookmarks,
            'stats' => $this->getStats(),
        ]);
    }

    protected function getStats(): array
    {
        $bookmarksCount = Bookmark::query()
            ->withoutGlobalScope(BookmarkNotArchivedScope::class)
            ->count();

        $tagsCount = DB::select("
            SELECT COUNT(DISTINCT(TRIM(tag))) as tag_count
            FROM (
                SELECT unnest(string_to_array(tags, '|')) AS tag
                FROM bookmarks
                WHERE tags IS NOT NULL
            ) AS sub
        ")[0]->tag_count;

        $collectionsCount = Collection::query()->count();

        $toReadCount = Bookmark::query()
            ->where('checked', false)
            ->count();

        $favoritesCount = Bookmark::query()
            ->where('is_fav', true)
            ->count();

        $archivedCount = Cache::remember('archived_count', 86400, static function () {
            return Bookmark::query()
                ->where('is_archived', true)
                ->withoutGlobalScope(BookmarkNotArchivedScope::class)
                ->count();
        });

        $brokenCount = Cache::remember('broken_count', 86400, static function () {
            return Bookmark::query()
                ->where('is_broken_link', true)
                ->withoutGlobalScope(BookmarkNotArchivedScope::class)
                ->count();
        });

        return [
            'bookmarks_count' => $bookmarksCount,
            'tags_count' => $tagsCount,
            'collections_count' => $collectionsCount,
            'to_read_count' => $toReadCount,
            'favorites_count' => $favoritesCount,
            'archived_count' => $archivedCount,
            'broken_count' => $brokenCount,
        ];
    }
}
