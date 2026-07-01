<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        // Admin punya akses ke semua halaman
        if (Auth::user()->role === 'admin') {
            return $next($request);
        }

        // Siswa hanya bisa akses jika role-nya diizinkan
        if (!in_array(Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}
