<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated AND if their 'is_admin' column is true.
        if ($request->user() && $request->user()->is_admin) {
            // If they are an admin, let the request continue to the controller.
            return $next($request);
        }

        // If they are not an admin, block the request with a "403 Forbidden" error.
        abort(403, 'Unauthorized action. You do not have admin privileges.');
    }
}
