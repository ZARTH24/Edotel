<?php

namespace App\Http\Middleware;

use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentProgress;
use App\Services\Simulation\SimulationService;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'message' => fn() => $request->session()->get('message'),
                'type' => fn() => $request->session()->get('type'),
                'validation' => fn() => $request->session()->get('validation'),
                'wrong_fields' => fn() => $request->session()->get('wrong_fields'),
                'is_simulation' => fn() => $request->session()->get('is_simulation'),
                'simulation_id' => fn() => $request->session()->get('simulation_id'),
            ],
            'auth' => [
                'user' => fn() => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'phone' => $request->user()->phone,
                    'is_menu_unlocked' => $request->user()->is_menu_unlocked ?? false,
                    'created_at' => $request->user()->created_at->diffForHumans(),
                    'updated_at' => $request->user()->updated_at->diffForHumans(),
                ] : null,
            ],
            'elearning' => $this->getElearningProgress($request->user()),
            'simulation' => $this->getSimulationData($request->user()),
        ];
    }

    /**
     * Get simulation mode data
     */
    protected function getSimulationData($user)
    {
        if (!$user || $user->role !== 'siswa') {
            return [
                'is_simulation_mode' => false,
                'is_student' => false,
                'summary' => null,
            ];
        }

        // Check if simulation mode is active OR if user has unlocked menus
        $isSimulationMode = SimulationService::isSimulationMode() || $user->is_menu_unlocked;

        // Ensure simulation mode is enabled in session if user has unlocked menus
        if (!$isSimulationMode && $user->is_menu_unlocked) {
            SimulationService::enableSimulation();
            $isSimulationMode = true;
        }

        return [
            'is_simulation_mode' => $isSimulationMode,
            'is_student' => true,
            'summary' => SimulationService::getSimulationSummary(),
        ];
    }

    /**
     * Get E-Learning progress for sidebar.
     */
    protected function getElearningProgress($user)
    {
        if (!$user) {
            return [
                'is_menu_unlocked' => false,
                'total_exercises' => 0,
                'completed_exercises' => 0,
                'progress_percentage' => 0,
            ];
        }

        $userId = $user->id;

        $totalExercises = Exercise::count();
        $completedExercises = StudentProgress::where('user_id', $userId)
            ->where('status', 'completed')
            ->count();

        $progressPercentage = $totalExercises > 0
            ? round(($completedExercises / $totalExercises) * 100)
            : 0;

        // All menus unlocked when all exercises completed
        $isMenuUnlocked = $totalExercises > 0
            && $completedExercises >= $totalExercises;

        return [
            'is_menu_unlocked' => $isMenuUnlocked,
            'total_exercises' => $totalExercises,
            'completed_exercises' => $completedExercises,
            'progress_percentage' => $progressPercentage,
        ];
    }
}
