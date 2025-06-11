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
}
