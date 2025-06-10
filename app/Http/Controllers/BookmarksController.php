<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookmarksController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::limit(100)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('bookmarks', [
            'bookmarks' => $bookmarks,
        ]);
    }
}
