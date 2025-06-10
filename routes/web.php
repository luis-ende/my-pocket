<?php

use App\Http\Controllers\BookmarksController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TagsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('bookmarks', [BookmarksController::class, 'index'])->name('bookmarks');
    Route::get('search-by-tags', function () {
        return Inertia::render('search-by-tags');
    })->name('search-by-tags');
    Route::get('tags/index', [TagsController::class, 'loadTags'])->name('tags.index');
    Route::get('tags/bookmarks', [TagsController::class, 'loadBookmarksByTags'])->name('tags.bookmarks');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
