<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\SecurityScheme;

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
        // Allow viewing API docs in all environments
        // You can customize this to restrict access if needed
        Gate::define('viewApiDocs', function ($user = null) {
            return true;
        });

        // Authentication in Scramble
        Scramble::extendOpenApi(function ($openApi) {
            $openApi->secure(
                SecurityScheme::http('bearer', 'JWT')
            );
        });

        // 🛡️ Global API Rate Limiter
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // 🛑 Strict Login Rate Limiter (Max 5 attempts per minute)
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
