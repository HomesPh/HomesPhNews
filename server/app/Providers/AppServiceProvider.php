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

        // 🛡️ Advanced API Rate Limiter (FAANG-inspired fingerprinting)
        // Differentiates users sharing the same IP (e.g., offices, public WiFi)
        RateLimiter::for('api', function (Request $request) {
            $fingerprint = sha1(implode('|', [
                $request->ip(),
                $request->header('User-Agent', 'unknown'),
                $request->header('Accept-Language', 'none')
            ]));

            return Limit::perMinute(300)->by($fingerprint);
        });

        // 🛑 Strict Login Rate Limiter (Max 5 attempts per minute)
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
