<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CollectionPostRequest;
use App\Models\Bookmark;
use App\Models\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
    public function index(): Response
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

    public function list(): JsonResponse
    {
        $collections = Collection::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'collections' => $collections,
        ]);
    }

    public function getCollectionBookmarks(int $collectionId): Response
    {
        $collection = Collection::query()
            ->select(['id', 'name', 'description'])
            ->findOrFail($collectionId);

        $bookmarks = Bookmark::query()
            ->whereRelation('collections', 'bookmark_collection.collection_id', $collectionId)
            ->latest()
            ->cursorPaginate(8);

        return Inertia::render('collections-bookmarks', [
            'collection' => $collection,
            'bookmarks' => $bookmarks,
        ]);
    }

    public function store(CollectionPostRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Collection::create($validated);

        return redirect()->back()->with('success', 'Collection created.');
    }

    public function update(CollectionPostRequest $request, Collection $collection): RedirectResponse
    {
        $validated = $request->validated();

        try {
            Collection::where('id', $collection->id)->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? true,
            ]);

            return redirect()->back()->with('success', 'Collection updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete collection.');
        }
    }

    public function destroy(Collection $collection): RedirectResponse
    {
        try {
            if ($collection->delete() === true) {
                return redirect()->back()->with('success', 'Collection removed.');
            }

            return redirect()->back()->with('error', 'Collection could not be removed.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete collection.');
        }
    }
}
