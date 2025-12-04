<?php

namespace App\Providers;

use App\Jobs\ProcessBookmarkCoverImage;
use App\Models\Bookmark;
use App\Models\Scopes\BookmarkNotArchivedScope;
use App\Services\LinkPreviewImageExtractor;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('bookmark', function ($value) {
            return Bookmark::withoutGlobalScope(BookmarkNotArchivedScope::class)
                ->where('id', $value)
                ->firstOrFail();
        });

        if (app()->environment('production') &&
            request()->header('X-Forwarded-Proto') === 'https') {
            URL::forceScheme('https');

            Paginator::currentPathResolver(function () {
                return URL::current(); // will now be https:// due to forceScheme above
            });
        }

        $this->app->bindMethod([ProcessBookmarkCoverImage::class, 'handle'],
            function (ProcessBookmarkCoverImage $job, Application $app) {
                $job->handle($app->make(LinkPreviewImageExtractor::class));
            }
        );
    }
}
