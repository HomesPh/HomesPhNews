<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: base_path('routes/web.php'),
        api: base_path('routes/api.php'),
        commands: base_path('routes/console.php'),
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // ✅ ADD THIS LINE to register your admin middleware alias
        $middleware->alias([
            'is.admin'    => \App\Http\Middleware\EnsureUserIsAdmin::class,
            'site.auth'   => \App\Http\Middleware\VerifySiteApiKey::class,
        ]);

        // You might have other middleware configurations here, leave them as they are.
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // ...
    })->create();
