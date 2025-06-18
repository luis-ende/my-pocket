<?php

use App\Http\Controllers\BookmarksController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TagsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('bookmarks', [BookmarksController::class, 'index'])->name('bookmarks');
    Route::post('bookmarks', [BookmarksController::class, 'store'])->name('bookmarks.store');
    Route::patch('bookmarks/{bookmark}', [BookmarksController::class, 'update'])->name('bookmarks.update');
    Route::patch('bookmarks/favs/{bookmarkId}/favorite', [BookmarksController::class, 'saveFav'])->name('bookmarks.favs');
    Route::patch('bookmarks/favs/{bookmarkId}/reads', [BookmarksController::class, 'saveRead'])->name('bookmarks.reads');
    Route::delete('bookmarks/{bookmark}', [BookmarksController::class, 'destroy'])->name('bookmarks.destroy');
    Route::get('search-by-tags', [TagsController::class, 'getBookmarksByTags'])->name('search-by-tags');
    Route::get('tags/index', [TagsController::class, 'getTagsByCount'])->name('tags.index');
    Route::get('tags/all', [TagsController::class, 'getAllTags'])->name('tags.all');
    Route::get('favorites', [BookmarksController::class, 'getFavorites'])->name('favorites');
    Route::get('collections', [CollectionController::class, 'index'])->name('collections');
    Route::get('collections/{collectionId}/bookmarks', [CollectionController::class, 'getCollectionBookmarks'])->name('collections.bookmarks');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
