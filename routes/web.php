<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::get('dashboard/section/tags', [DashboardController::class, 'loadTags'])->name('dashboard.tags');
    Route::get('dashboard/section/bookmarks', [DashboardController::class, 'loadBookmarksByTags'])->name('dashboard.bookmarks');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
