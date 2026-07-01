<?php

namespace App\Http\Middleware;

use App\Services\Simulation\SimulationService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * SimulationModeMiddleware
 *
 * Detects if user is a "siswa" (student) with unlocked menus.
 * In simulation mode, all write operations are stored in session instead of database.
 */
class SimulationModeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();

            // Only enable simulation mode for students with unlocked menus
            if ($user->role === 'siswa' && $user->is_menu_unlocked) {
                // Enable simulation mode
                SimulationService::enableSimulation();

                // Add simulation mode flag to all views
                view()->share('isSimulationMode', true);
                view()->share('simulationData', SimulationService::getSimulationSummary());
            } else {
                // Disable simulation mode for non-students or locked students
                SimulationService::disableSimulation();
                view()->share('isSimulationMode', false);
            }
        }

        return $next($request);
    }
}
