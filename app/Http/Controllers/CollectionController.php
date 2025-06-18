<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Collection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::query()
            ->select('id', 'description', 'name')
            ->withCount('bookmarks')
            ->latest()
            ->orderBy('name')
            ->get();

        return Inertia::render('collections', [
            'collections' => $collections,
        ]);
    }

    public function getCollectionBookmarks(int $collectionId)
    {
        $bookmarks = Bookmark::query()
            ->select('bookmarks.id', 'title', 'url', 'tags', 'checked', 'is_fav')
            ->whereRelation('collections', 'bookmark_collection.id', $collectionId)
            ->latest()
            ->cursorPaginate(5);

        return Inertia::render('collections-bookmarks', [
            'bookmarks' => $bookmarks,
        ]);
    }
}
