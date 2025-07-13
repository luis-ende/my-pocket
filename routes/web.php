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
    Route::get('archive', [BookmarksController::class, 'indexArchive'])->name('bookmarks.archive');
    Route::get('search', [BookmarksController::class, 'indexSearch'])->name('bookmarks.search');
    Route::patch('bookmarks/{bookmark}', [BookmarksController::class, 'update'])->name('bookmarks.update');
    Route::patch('bookmarks/{bookmarkId}/favorite', [BookmarksController::class, 'saveFav'])->name('bookmarks.favs');
    Route::patch('bookmarks/{bookmarkId}/reads', [BookmarksController::class, 'saveRead'])->name('bookmarks.reads');
    Route::patch('bookmarks/{bookmarkId}/archive', [BookmarksController::class, 'saveArchive'])->name('bookmarks.archive');
    Route::patch('bookmarks/{bookmarkId}/broken-link', [BookmarksController::class, 'saveBrokenLink'])->name('bookmarks.broken-link');
    Route::delete('bookmarks/{bookmark}', [BookmarksController::class, 'destroy'])->name('bookmarks.destroy');
    Route::get('search-by-tags', [TagsController::class, 'getBookmarksByTags'])->name('search-by-tags');
    Route::get('tags/index', [TagsController::class, 'getTagsByCount'])->name('tags.index');
    Route::get('tags/all', [TagsController::class, 'getAllTags'])->name('tags.all');
    Route::get('favorites', [BookmarksController::class, 'getFavorites'])->name('favorites');
    Route::get('collections', [CollectionController::class, 'index'])->name('collections');
    Route::get('collections/list', [CollectionController::class, 'list'])->name('collections.list');
    Route::post('collections', [CollectionController::class, 'store'])->name('collections');
    Route::patch('collections/{collection}', [CollectionController::class, 'update'])->name('collections.update');
    Route::delete('collections/{collection}', [CollectionController::class, 'destroy'])->name('collections.destroy');
    Route::get('collections/{collectionId}/bookmarks', [CollectionController::class, 'getCollectionBookmarks'])->name('collections.bookmarks');
    Route::post('bookmarks/add-to-collection', [BookmarksController::class, 'addToCollection'])->name('bookmarks.addToCollection');
    Route::get('bookmarks/{bookmarkId}/collections', [BookmarksController::class, 'getCollections'])->name('bookmarks.collections');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
