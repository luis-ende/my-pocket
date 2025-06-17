<?php

namespace App\Http\Controllers;

use App\Models\Bookmark;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $bookmarks = Bookmark::query()
            ->where('checked', false)
            ->latest()
            ->cursorPaginate(3);

        return Inertia::render('dashboard', [
            'bookmarks' => $bookmarks,
        ]);
    }
}
