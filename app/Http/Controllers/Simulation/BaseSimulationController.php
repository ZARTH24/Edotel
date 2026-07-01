<?php

namespace App\Http\Controllers\Simulation;

use App\Http\Controllers\Controller;
use App\Services\Simulation\SimulationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * BaseSimulationController
 *
 * Base controller that handles simulation mode for students.
 * All write operations are intercepted and stored in session.
 */
class BaseSimulationController extends Controller
{
    /**
     * Check if current user is in simulation mode
     */
    protected function isSimulationMode(): bool
    {
        return SimulationService::isSimulationMode();
    }

    /**
     * Check if user has completed E-Learning
     */
    protected function hasCompletedELearning(): bool
    {
        return SimulationService::hasCompletedELearning();
    }

    /**
     * Get simulation data summary
     */
    protected function getSimulationSummary(): array
    {
        return SimulationService::getSimulationSummary();
    }

    /**
     * Redirect with simulation mode message
     */
    protected function simulationMessage(string $message): array
    {
        return [
            'message' => $message,
            'type' => 'info',
            'is_simulation' => true,
        ];
    }

    /**
     * Get current user role
     */
    protected function getUserRole(): ?string
    {
        return Auth::user()?->role;
    }

    /**
     * Check if user is a student
     */
    protected function isStudent(): bool
    {
        return $this->getUserRole() === 'siswa';
    }
}
