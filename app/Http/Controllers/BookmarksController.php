<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\BookmarkCollectionsPostRequest;
use App\Http\Requests\BookmarkPatchRequest;
use App\Http\Requests\BookmarkPostRequest;
use App\Models\Bookmark;
use App\Models\Scopes\BookmarkNotArchivedScope;
use App\Services\FetchUrlTitleService;
use App\Services\LinkPreviewImageExtractor;
use App\Services\LinkUrlCleanService;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

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

    public function indexArchive(): Response
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

    public function indexSearch(Request $request): Response
    {
        try {
            $validated = $request->validate([
                'query' => 'string|required|max:255',
            ]);
            $searchTerm = $validated['query'];
        } catch (\Throwable $e) {
            $searchTerm = '';
        }

        $searchTerm = urldecode($searchTerm);
        $bookmarks = [];
        if (! empty($searchTerm)) {
            $bookmarks = Bookmark::search($searchTerm)
                ->query(function ($query) {
                    $query->withoutGlobalScope(BookmarkNotArchivedScope::class);
                })
                ->latest()
                ->paginate(8);
        }

        return Inertia::render('search', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function indexFavorites(): Response
    {
        $bookmarks = Bookmark::query()
            ->where('is_fav', true)
            ->latest()
            ->cursorPaginate(8);

        return Inertia::render('favorites', [
            'bookmarks' => $bookmarks,
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(BookmarkPostRequest $request,
        LinkPreviewImageExtractor $linkPreviewImageExtractor,
        LinkUrlCleanService $linkUrlCleanService): void
    {

        $validated = $request->validated();

        $validated['url'] = $linkUrlCleanService->cleanTrackingParameters($validated['url']);
        $validated['checked'] = $validated['read'] ?? true;

        DB::transaction(function () use ($linkPreviewImageExtractor, $validated) {
            $bookmark = Bookmark::create($validated);
            $bookmark->savePreviewImage($linkPreviewImageExtractor);

            $savedBookmark = array_merge($bookmark->toArray(), [
                'is_new' => true,
            ]);

            return redirect()->back()->with([
                'success' => 'Bookmark created.',
                'saved_bookmark' => $savedBookmark,
            ]);
        });
    }

    /**
     * @return Application|RedirectResponse|Redirector|object|void
     */
    public function update(BookmarkPatchRequest $request, Bookmark $bookmark, LinkPreviewImageExtractor $linkPreviewImageExtractor)
    {
        $referer = $request->header('referer');
        if ($referer) {
            $parsedUrl = parse_url($referer);
            $path = $parsedUrl['path'] ?? '/';
            $path = strtok($path, '?');
        } else {
            $path = strtok($request->path(), '?');
        }

        $validated = $request->validated();

        try {
            Bookmark::withoutGlobalScopes()
                ->where('id', $bookmark->id)->update([
                    'tags' => empty($validated['tags']) ? null : $validated['tags'],
                    'checked' => $validated['read'] ?? true,
                ]);

            if (! $bookmark->is_broken_link && $bookmark->getMedia('preview')->isEmpty()) {
                $bookmark->savePreviewImage($linkPreviewImageExtractor);
            }

            $savedBookmark = array_merge($bookmark->refresh()->toArray(), [
                'is_new' => false,
            ]);

            redirect($path)->with([
                'success' => 'Bookmark updated.',
                'saved_bookmark' => $savedBookmark,
            ]);
        } catch (\Exception $e) {
            return redirect($path)->with([
                'error' => 'Failed to update bookmark.',
            ]);
        }
    }

    public function updateBulk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bookmark_ids' => 'required|array',
            'tags' => 'nullable|string',
            'checked' => 'nullable|boolean',
            'is_fav' => 'nullable|boolean',
            'is_archived' => 'nullable|boolean',
        ]);

        $toUpdate = [];
        if ($validated['tags'] !== null) {
            $toUpdate['tags'] = $validated['tags'];
        }

        if ($validated['checked'] !== null) {
            $toUpdate['checked'] = $validated['checked'];
        }

        if ($validated['is_fav'] !== null) {
            $toUpdate['is_fav'] = $validated['is_fav'];
        }

        if ($validated['is_archived'] !== null) {
            $toUpdate['is_archived'] = $validated['is_archived'];
        }

        if (! empty($toUpdate)) {
            $result = Bookmark::withoutGlobalScopes()
                ->whereIn('id', $validated['bookmark_ids'])->update($toUpdate);

            if ($result > 0) {
                return redirect()->back()->with('success', "{$result} bookmarks updated.");
            } else {
                return redirect()->back()->with('error', "Bookmarks couldn't be updated.");
            }
        }

        return redirect()->back()->with('error', "Bookmarks couldn't be updated.");
    }

    public function saveFav(Request $request, int $bookmarkId): RedirectResponse
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

    public function saveRead(Request $request, int $bookmarkId): void
    {
        $validated = $request->validate([
            'read' => 'required|boolean',
        ]);

        Bookmark::withoutGlobalScopes()
            ->where('id', $bookmarkId)->update([
                'checked' => $validated['read'],
            ]);
    }

    public function saveArchive(Request $request, int $bookmarkId): RedirectResponse
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

    public function saveBrokenLink(Request $request, int $bookmarkId): void
    {
        $validated = $request->validate([
            'is_broken_link' => 'required|boolean',
        ]);

        Bookmark::withoutGlobalScopes()
            ->where('id', $bookmarkId)->update([
                'is_broken_link' => $validated['is_broken_link'],
            ]);
    }

    public function destroy(Bookmark $bookmark): RedirectResponse
    {
        try {
            if ($bookmark->delete() === true) {
                return redirect()->back()->with('success', 'Bookmark removed.');
            }

            return redirect()->back()->with('error', 'Bookmark could not be removed.');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to delete bookmark.');
        }
    }

    public function destroyBulk(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bookmark_ids' => 'required|array',
        ]);

        try {
            $result = Bookmark::withoutGlobalScopes()
                ->whereIn('id', $validated['bookmark_ids'])
                ->delete();
            if ($result >= 1) {
                return redirect()->back()->with('success', "{$result} bookmarks removed.");
            }

            return redirect()->back()->with('error', 'Bookmarks could not be removed.');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to delete bookmarks.');
        }
    }

    public function addToCollection(BookmarkCollectionsPostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        try {
            DB::table('bookmark_collection')
                ->whereIn('bookmark_id', $validated['bookmarkIds'])
                ->delete();

            foreach ($validated['bookmarkIds'] as $bookmarkId) {
                DB::table('bookmark_collection')->insert([
                    'bookmark_id' => $bookmarkId,
                    'collection_id' => $validated['collectionId'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $count = count($validated['bookmarkIds']);

            return redirect()->back()->with('success', "{$count} bookmarks added to collection.");
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to add bookmarks to collection.');
        }
    }

    public function removeFromCollection(BookmarkCollectionsPostRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        try {
            $count = DB::table('bookmark_collection')
                ->where('collection_id', $validated['collectionId'])
                ->whereIn('bookmark_id', $validated['bookmarkIds'])
                ->delete();

            return redirect()->back()->with('success', "{$count} bookmarks removed from collection.");
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to remove bookmarks from collection.');
        }
    }

    public function getCollections(int $bookmarkId): JsonResponse
    {
        $collectionId = Bookmark::query()->findOrFail($bookmarkId)
            ->collections()
            ->select('collections.id')
            ->first()?->id;

        return response()->json([
            'bookmarkId' => $bookmarkId,
            'collectionId' => $collectionId,
        ]);
    }

    public function getBookmarkTitle(Request $request, FetchUrlTitleService $fetchUrlTitleService): JsonResponse
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
