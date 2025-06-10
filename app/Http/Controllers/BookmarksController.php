<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
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
}
