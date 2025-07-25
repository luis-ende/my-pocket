<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Models\Scopes\BookmarkNotArchivedScope;
use App\Services\FetchUrlTitleService;
use App\Services\LinkPreviewImageExtractor;
use App\Services\LinkUrlCleanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BookmarksController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::query()
            ->latest()
            ->cursorPaginate(8);

        return Inertia::render('bookmarks', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function indexArchive()
    {
        $bookmarks = Bookmark::query()
            ->where('is_archived', true)
            ->latest()
            ->withoutGlobalScope(BookmarkNotArchivedScope::class)
            ->cursorPaginate(8);

        return Inertia::render('archive', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function indexSearch(Request $request)
    {
        try {
            $validated = $request->validate([
                'query' => 'string|required|max:255',
            ]);
            $searchTerm = $validated['query'];
        } catch (\Throwable $e) {
            $searchTerm = '';
        }

        $bookmarks = [];
        if (! empty($searchTerm)) {
            $bookmarks = Bookmark::search($searchTerm)
                ->query(function ($query) {
                    // Also include archived bookmarks
                    $query->withoutGlobalScope(BookmarkNotArchivedScope::class);
                })
                ->latest()
                ->paginate(8);
        }

        return Inertia::render('search', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function getFavorites()
    {
        $bookmarks = Bookmark::query()
            ->where('is_fav', true)
            ->latest()
            ->cursorPaginate(8);

        return Inertia::render('favorites', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function store(Request $request,
        LinkPreviewImageExtractor $linkPreviewImageExtractor,
        LinkUrlCleanService $linkUrlCleanService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:400',
            'url' => 'required|url|max:900',
            'tags' => 'max:300',
            'read' => 'boolean',
        ]);

        $validated['url'] = $linkUrlCleanService->cleanTrackingParameters($validated['url']);
        $validated['checked'] = $validated['read'] ?? true;

        DB::transaction(function () use ($linkPreviewImageExtractor, $validated) {
            $bookmark = Bookmark::create($validated);

            $imageUrl = $linkPreviewImageExtractor->extractPreviewImage($validated['url']);
            if (! empty($imageUrl)) {
                $bookmark->addMediaFromUrl($imageUrl)->toMediaCollection('preview');
            }

            return redirect()->back()->with('success', 'Bookmark created.');
        });

        return redirect()->back()->with('error', 'Bookmark couldn\'t be created.');
    }

    public function update(Request $request, Bookmark $bookmark)
    {
        $validated = $request->validate([
            'tags' => 'max:300',
            'read' => 'boolean',
            // 'notes' => 'string|max:300',
        ]);

        try {
            Bookmark::withoutGlobalScopes()
                ->where('id', $bookmark->id)->update([
                'tags' => empty($validated['tags']) ? null : $validated['tags'],
                'checked' => $validated['read'] ?? true,
            ]);

            return redirect()->back()->with('success', 'Bookmark updated.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete bookmark.');
        }
    }

    public function saveFav(Request $request, int $bookmarkId)
    {
        $validated = $request->validate([
            'is_fav' => 'required|boolean',
        ]);

        Bookmark::withoutGlobalScopes()
            ->where('id', $bookmarkId)->update([
            'is_fav' => $validated['is_fav'],
        ]);

        return redirect()->back();
    }

    public function saveRead(Request $request, int $bookmarkId)
    {
        $validated = $request->validate([
            'read' => 'required|boolean',
        ]);

        Bookmark::withoutGlobalScopes()
            ->where('id', $bookmarkId)->update([
            'checked' => $validated['read'],
        ]);
    }

    public function saveArchive(Request $request, int $bookmarkId)
    {
        $validated = $request->validate([
            'archive' => 'required|boolean',
        ]);

        Bookmark::withoutGlobalScopes()
            ->where('id', $bookmarkId)->update([
            'is_archived' => $validated['archive'],
        ]);

        if ($validated['archive'] === true) {
            return redirect()->back()->with('success', 'Bookmark archived.');
        } else {
            return redirect()->back()->with('success', 'Bookmark un-archived.');
        }
    }

    public function saveBrokenLink(Request $request, int $bookmarkId)
    {
        $validated = $request->validate([
            'is_broken_link' => 'required|boolean',
        ]);

        Bookmark::withoutGlobalScopes()
            ->where('id', $bookmarkId)->update([
                'is_broken_link' => $validated['is_broken_link'],
            ]);
    }

    public function destroy(Bookmark $bookmark)
    {
        try {
            if ($bookmark->delete() === 1) {
                return redirect()->back()->with('success', 'Bookmark removed.');
            }

            return redirect()->back()->with('error', 'Bookmark could not be removed.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete bookmark.');
        }
    }

    public function addToCollection(Request $request)
    {
        $validated = $request->validate([
            'bookmarkId' => 'required|integer|exists:bookmarks,id',
            'collectionId' => 'required|integer|exists:collections,id',
        ]);

        DB::delete('DELETE FROM bookmark_collection WHERE bookmark_id = ?',
            [$validated['bookmarkId']]);
        DB::table('bookmark_collection')->insert([
            'bookmark_id' => $validated['bookmarkId'],
            'collection_id' => $validated['collectionId'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Bookmark was added to collection.');
    }

    public function getCollections(int $bookmarkId)
    {
        $collectionId = Bookmark::findOrFail($bookmarkId)
            ->collections()
            ->select('collections.id')
            ->first()?->id;

        return response()->json([
            'bookmarkId' => $bookmarkId,
            'collectionId' => $collectionId,
        ]);
    }

    public function getBookmarkTitle(Request $request, FetchUrlTitleService $fetchUrlTitleService)
    {
        $validated = $request->validate([
            'target' => 'required|string|url',
        ]);

        $url = $validated['target'];
        $title = $fetchUrlTitleService->getTitle($url);
        if (empty($title)) {
            $title = $fetchUrlTitleService->generateTitleFromUrl($url);
        }

        return response()->json([
            'title' => $title,
        ]);
    }
}
