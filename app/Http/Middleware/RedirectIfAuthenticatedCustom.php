<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticatedCustom
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            // Ambil role user
            $role = Auth::user()->role ?? 'user'; // default jika role belum ada

            // Redirect berdasarkan role
            if (in_array($role, ['admin', 'front-office', 'housekeeping'])) {
                // Staff -> Dashboard
                return redirect('/Dashboard');
            } else {
                // Siswa -> Siswa Dashboard
                return redirect('/siswa/dashboard');
            }
        }
        return $next($request);
    }
}
