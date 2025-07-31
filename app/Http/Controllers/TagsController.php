<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Scopes\BookmarkNotArchivedScope;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TagsController extends Controller
{
    public function getTagsByCount()
    {
        $tags = DB::table(DB::raw('(
                SELECT unnest(string_to_array(tags, \'|\')) AS tag
                FROM bookmarks
                WHERE tags IS NOT NULL
            ) AS sub'))
            ->selectRaw('DISTINCT(TRIM(tag)) AS id, COUNT(tag) AS count')
            ->where('tag', '<>', '')
            ->groupBy('tag')
            ->orderByDesc('count')
            ->get();

        $tags->unshift((object) [
            'id' => 'not-tagged',
            'title' => 'Not Tagged',
            'count' => Bookmark::whereNull('tags')->count(),
        ]);

        return response()->json([
            'tags' => $tags,
        ]);
    }

    public function getAllTags()
    {
        $tags = DB::table(DB::raw('(
                SELECT unnest(string_to_array(tags, \'|\')) AS tag
                FROM bookmarks
                WHERE tags IS NOT NULL
            ) AS sub'))
            ->selectRaw('DISTINCT(TRIM(tag)) AS tag')
            ->where('tag', '<>', '')
            ->groupBy('tag')
            ->orderBy('tag')
            ->get();

        return response()->json([
            'tags' => $tags,
        ]);
    }

    public function getBookmarksByTags(Request $request)
    {
        $tags = $request->input('tags', []);

        if (empty($tags)) {
            return Inertia::render('search-by-tags', [
                'bookmarks' => [],
            ]);
        }

        $pgArray = 'ARRAY['.collect($tags)
            ->map(fn ($tag) => DB::getPdo()->quote(strtolower($tag)))
            ->implode(',').']';
        $bookmarksQuery = Bookmark::whereRaw("
            EXISTS (
                SELECT 1 FROM unnest(string_to_array(tags, '|')) AS tag
                WHERE tag = ANY ($pgArray)
            )");

        if (in_array('not-tagged', $tags)) {
            $bookmarksQuery = $bookmarksQuery->orWhereNull('tags');
        }

        $bookmarks = $bookmarksQuery
            ->latest()
            ->withoutGlobalScope(BookmarkNotArchivedScope::class)
            ->cursorPaginate(8);

        return Inertia::render('search-by-tags', [
            'bookmarks' => $bookmarks,
        ]);
    }
}
