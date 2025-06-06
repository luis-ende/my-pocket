<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {

    }

    public function loadTags()
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

        return response()->json([
            'tags' => $tags,
        ]);
    }

    public function loadBookmarksByTags(Request $request)
    {
        $tags = $request->input('tags', []);

        if (empty($tags)) {
            return [];
        }

        $pgArray = 'ARRAY[' . collect($tags)
                                ->map(fn($tag) => DB::getPdo()->quote(strtolower($tag)))
                                ->implode(',') . ']';
        $bookmarks = Bookmark::whereRaw("
            EXISTS (
                SELECT 1 FROM unnest(string_to_array(tags, '|')) AS tag
                WHERE tag = ANY ($pgArray)
            )")->get();

        return response()->json([
            'bookmarks' => $bookmarks,
        ]);
    }
}
