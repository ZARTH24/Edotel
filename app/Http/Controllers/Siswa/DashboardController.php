<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentProgress;
use App\Models\ELearning\StudentAnswer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Display siswa dashboard with progress overview.
     */
    public function index()
    {
        $userId = Auth::id();

        // Get reception exercises with progress
        $receptionExercises = Exercise::reception()->ordered()->get()->map(function ($exercise) use ($userId) {
            $progress = StudentProgress::where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->first();
            $answer = StudentAnswer::where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->first();

            return [
                'id' => $exercise->id,
                'title' => $exercise->title,
                'slug' => $exercise->slug,
                'order_number' => $exercise->order_number,
                'status' => $progress?->status ?? 'locked',
                'completed_at' => $progress?->completed_at,
                'is_completed' => $answer?->is_completed ?? false,
            ];
        });

        // Get reservation exercises with progress
        $reservationExercises = Exercise::reservation()->ordered()->get()->map(function ($exercise) use ($userId) {
            $progress = StudentProgress::where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->first();
            $answer = StudentAnswer::where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->first();

            return [
                'id' => $exercise->id,
                'title' => $exercise->title,
                'slug' => $exercise->slug,
                'order_number' => $exercise->order_number,
                'status' => $progress?->status ?? 'locked',
                'completed_at' => $progress?->completed_at,
                'is_completed' => $answer?->is_completed ?? false,
            ];
        });

        // Calculate stats
        $receptionTotal = $receptionExercises->count();
        $receptionCompleted = $receptionExercises->where('status', 'completed')->count();
        $receptionInProgress = $receptionExercises->where('status', 'opened')->count();
        $receptionProgress = $receptionTotal > 0 ? round(($receptionCompleted / $receptionTotal) * 100) : 0;

        $reservationTotal = $reservationExercises->count();
        $reservationCompleted = $reservationExercises->where('status', 'completed')->count();
        $reservationInProgress = $reservationExercises->where('status', 'opened')->count();
        $reservationProgress = $reservationTotal > 0 ? round(($reservationCompleted / $reservationTotal) * 100) : 0;

        $totalExercises = $receptionTotal + $reservationTotal;
        $totalCompleted = $receptionCompleted + $reservationCompleted;
        $totalInProgress = $receptionInProgress + $reservationInProgress;
        $totalLocked = $totalExercises - $receptionCompleted - $receptionInProgress - $reservationCompleted - $reservationInProgress;
        $totalProgress = $totalExercises > 0 ? round(($totalCompleted / $totalExercises) * 100) : 0;

        // Check unlock status
        $user = User::find($userId);
        $isMenuUnlocked = $user->is_menu_unlocked ?? false;

        // Check if all exercises are completed
        $allCompleted = $totalCompleted >= $totalExercises && $totalExercises > 0;

        return inertia('Siswa/Dashboard/Index', [
            'receptionExercises' => $receptionExercises,
            'reservationExercises' => $reservationExercises,
            'stats' => [
                'total_progress' => $totalProgress,
                'total_completed' => $totalCompleted,
                'total_in_progress' => $totalInProgress,
                'total_not_completed' => $totalExercises - $totalCompleted,
                'total_exercises' => $totalExercises,
                'reception_progress' => $receptionProgress,
                'reception_completed' => $receptionCompleted,
                'reception_in_progress' => $receptionInProgress,
                'reception_total' => $receptionTotal,
                'reservation_progress' => $reservationProgress,
                'reservation_completed' => $reservationCompleted,
                'reservation_in_progress' => $reservationInProgress,
                'reservation_total' => $reservationTotal,
                'all_completed' => $allCompleted,
            ],
            'unlockStatus' => [
                'is_unlocked' => $isMenuUnlocked,
                'front_office' => $isMenuUnlocked ? 'unlocked' : 'locked',
                'housekeeping' => $isMenuUnlocked ? 'unlocked' : 'locked',
                'damage_report' => $isMenuUnlocked ? 'unlocked' : 'locked',
            ],
        ]);
    }
}
