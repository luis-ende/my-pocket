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

    public function list()
    {
        $collections = Collection::query()
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'collections' => $collections,
        ]);
    }

    public function getCollectionBookmarks(int $collectionId)
    {
        $collection = Collection::query()
            ->select('id', 'name', 'description')
            ->findOrFail($collectionId);

        $bookmarks = Bookmark::query()
            ->select('bookmarks.id', 'title', 'url', 'tags', 'checked', 'is_fav')
            ->whereRelation('collections', 'bookmark_collection.collection_id', $collectionId)
            ->latest()
            ->cursorPaginate(5);

        return Inertia::render('collections-bookmarks', [
            'collection' => $collection,
            'bookmarks' => $bookmarks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'string|max:200',
        ]);

        Collection::create($validated);

        return redirect()->back()->with('success', 'Collection created.');
    }
}
