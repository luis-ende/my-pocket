<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use App\Services\FetchUrlTitleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookmarksController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::query()
            ->latest()
            ->cursorPaginate(5);

        return Inertia::render('bookmarks', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function getFavorites()
    {
        $bookmarks = Bookmark::query()
            ->where('is_fav', true)
            ->latest()
            ->cursorPaginate(5);

        return Inertia::render('favorites', [
            'bookmarks' => $bookmarks,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'url' => 'required|url|max:900',
            'tags' => 'required|max:300',
            'read' => 'boolean'
        ]);

        $title = (new FetchUrlTitleService)->getTitle($validated['url']);
        if (empty($title)) {
            $title = 'Page title not found';
        }
        $validated['title'] = $title;
        $validated['checked'] = $validated['read'] ?? true;

        Bookmark::create($validated);

        return redirect()->back()->with('success', 'Bookmark created.');
    }

    public function update(Request $request, Bookmark $bookmark)
    {
        $validated = $request->validate([
            'tags' => 'max:300',
            'read' => 'boolean',
            //'notes' => 'string|max:300',
        ]);

        try {
            Bookmark::where('id', $bookmark->id)->update([
                'tags' => $validated['tags'],
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
            'is_fav' => 'required|boolean'
        ]);

        Bookmark::where('id', $bookmarkId)->update(['is_fav' => $validated['is_fav']]);

        return redirect()->back();
    }

    public function destroy(Bookmark $bookmark)
    {
        try {
            if  ($bookmark->delete() === 1) {
                return redirect()->back()->with('success', 'Bookmark removed.');
            }

            return redirect()->back()->with('error', 'Bookmark could not be removed.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete bookmark.');
        }
    }
}
