<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUnlock
{
    /**
     * Handle an incoming request.
     * Blocks siswa role if menu is not unlocked.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();

        // Only check for siswa role
        if ($user->role === 'siswa') {
            // If menu is not unlocked, block access
            if (!$user->is_menu_unlocked) {
                abort(403, 'Selesaikan seluruh latihan E-Learning terlebih dahulu untuk mengakses menu ini.');
            }
        }

        return $next($request);
    }
}
