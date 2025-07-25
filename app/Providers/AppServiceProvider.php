<?php

namespace App\Providers;

use Illuminate\Pagination\Paginator;
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
        if (app()->environment('production') &&
            request()->header('X-Forwarded-Proto') === 'https') {
            URL::forceScheme('https');

            Paginator::currentPathResolver(function () {
                return URL::current(); // will now be https:// due to forceScheme above
            });
        }
    }
}
