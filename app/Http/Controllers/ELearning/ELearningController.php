<?php

namespace App\Http\Controllers\ELearning;

use App\Http\Controllers\Controller;
use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ELearningController extends Controller
{
    /**
     * Display E-Learning index page (category selection).
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Get exercises with progress
        $receptionExercises = Exercise::with(['studyCase'])
            ->reception()
            ->ordered()
            ->get()
            ->map(function ($exercise) use ($userId) {
                $progress = StudentProgress::where('user_id', $userId)
                    ->where('exercise_id', $exercise->id)
                    ->first();

                return [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'slug' => $exercise->slug,
                    'order_number' => $exercise->order_number,
                    'status' => $progress?->status ?? 'locked',
                    'completed_at' => $progress?->completed_at,
                ];
            });

        $reservationExercises = Exercise::with(['studyCase'])
            ->reservation()
            ->ordered()
            ->get()
            ->map(function ($exercise) use ($userId) {
                $progress = StudentProgress::where('user_id', $userId)
                    ->where('exercise_id', $exercise->id)
                    ->first();

                return [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'slug' => $exercise->slug,
                    'order_number' => $exercise->order_number,
                    'status' => $progress?->status ?? 'locked',
                    'completed_at' => $progress?->completed_at,
                ];
            });

        // Calculate progress
        $receptionTotal = $receptionExercises->count();
        $receptionCompleted = $receptionExercises->where('status', 'completed')->count();
        $receptionProgress = $receptionTotal > 0 ? round(($receptionCompleted / $receptionTotal) * 100) : 0;

        $reservationTotal = $reservationExercises->count();
        $reservationCompleted = $reservationExercises->where('status', 'completed')->count();
        $reservationProgress = $reservationTotal > 0 ? round(($reservationCompleted / $reservationTotal) * 100) : 0;

        $totalExercises = $receptionTotal + $reservationTotal;
        $totalCompleted = $receptionCompleted + $reservationCompleted;
        $totalProgress = $totalExercises > 0 ? round(($totalCompleted / $totalExercises) * 100) : 0;

        // Check if all exercises completed (for unlocking other menus)
        $allCompleted = $totalCompleted >= $totalExercises && $totalExercises > 0;

        return inertia('ELearning/Index', [
            'receptionExercises' => $receptionExercises,
            'reservationExercises' => $reservationExercises,
            'stats' => [
                'reception_progress' => $receptionProgress,
                'reception_completed' => $receptionCompleted,
                'reception_total' => $receptionTotal,
                'reservation_progress' => $reservationProgress,
                'reservation_completed' => $reservationCompleted,
                'reservation_total' => $reservationTotal,
                'total_progress' => $totalProgress,
                'total_completed' => $totalCompleted,
                'total_exercises' => $totalExercises,
                'remaining' => $totalExercises - $totalCompleted,
                'all_completed' => $allCompleted,
            ],
        ]);
    }
}
