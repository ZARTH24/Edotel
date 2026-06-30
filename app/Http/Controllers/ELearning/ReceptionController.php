<?php

namespace App\Http\Controllers\ELearning;

use App\Http\Controllers\Controller;
use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentAnswer;
use App\Models\ELearning\StudentProgress;
use App\Services\ELearning\ExerciseFormService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReceptionController extends Controller
{
    /**
     * Display reception exercises list.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Ensure progress exists for this user
        $this->ensureProgressExists($userId, 'reception');

        $exercises = Exercise::with(['studyCase'])
            ->reception()
            ->ordered()
            ->get()
            ->map(function ($exercise) use ($userId) {
                $progress = StudentProgress::where('user_id', $userId)
                    ->where('exercise_id', $exercise->id)
                    ->first();

                // Get latest answer
                $latestAnswer = StudentAnswer::where('user_id', $userId)
                    ->where('exercise_id', $exercise->id)
                    ->latest()
                    ->first();

                return [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'slug' => $exercise->slug,
                    'order_number' => $exercise->order_number,
                    'document_path' => $exercise->document_path,
                    'status' => $progress?->status ?? 'locked',
                    'completed_at' => $progress?->completed_at,
                    'attempts' => $latestAnswer?->attempt ?? 0,
                    'is_completed' => $progress?->status === 'completed',
                ];
            });

        // Calculate progress
        $total = $exercises->count();
        $completed = $exercises->where('status', 'completed')->count();
        $progress = $total > 0 ? round(($completed / $total) * 100) : 0;

        return inertia('ELearning/Reception/Index', [
            'exercises' => $exercises,
            'stats' => [
                'total' => $total,
                'completed' => $completed,
                'progress' => $progress,
            ],
        ]);
    }

    /**
     * Display study case and exercise form.
     */
    public function show(Request $request, string $slug)
    {
        $userId = Auth::id();

        $exercise = Exercise::with(['studyCase'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Get or create progress
        $progress = StudentProgress::firstOrCreate(
            [
                'user_id' => $userId,
                'exercise_id' => $exercise->id,
            ],
            [
                'status' => 'locked',
            ]
        );

        // If locked, redirect back
        if ($progress->status === 'locked') {
            return redirect()->route('elearning.reception.index')
                ->with('message', 'Selesaikan latihan sebelumnya terlebih dahulu.')
                ->with('type', 'error');
        }

        // Get latest answer
        $latestAnswer = StudentAnswer::where('user_id', $userId)
            ->where('exercise_id', $exercise->id)
            ->latest()
            ->first();

        // Get previous exercise (for back navigation)
        $prevExercise = Exercise::reception()
            ->where('order_number', '<', $exercise->order_number)
            ->orderBy('order_number', 'desc')
            ->first();

        // Get next exercise
        $nextExercise = Exercise::reception()
            ->where('order_number', '>', $exercise->order_number)
            ->orderBy('order_number', 'asc')
            ->first();

        return inertia('ELearning/Reception/Show', [
            'exercise' => [
                'id' => $exercise->id,
                'title' => $exercise->title,
                'slug' => $exercise->slug,
                'document_path' => $exercise->document_path,
                'order_number' => $exercise->order_number,
            ],
            'study_case' => $exercise->studyCase ? [
                'title' => $exercise->studyCase->title,
                'content' => $exercise->studyCase->content,
                'estimated_time' => $exercise->studyCase->estimated_time,
            ] : null,
            'progress' => [
                'status' => $progress->status,
                'is_completed' => $progress->status === 'completed',
            ],
            'latest_answer' => $latestAnswer?->answers,
            'attempts' => $latestAnswer?->attempt ?? 0,
            'navigation' => [
                'prev' => $prevExercise ? [
                    'slug' => $prevExercise->slug,
                    'title' => $prevExercise->title,
                ] : null,
                'next' => $nextExercise ? [
                    'slug' => $nextExercise->slug,
                    'title' => $nextExercise->title,
                ] : null,
            ],
        ]);
    }

    /**
     * Submit exercise answer.
     */
    public function submit(Request $request, string $slug)
    {
        $userId = Auth::id();

        $exercise = Exercise::with(['studyCase'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Get or create progress
        $progress = StudentProgress::firstOrCreate(
            [
                'user_id' => $userId,
                'exercise_id' => $exercise->id,
            ],
            [
                'status' => 'locked',
            ]
        );

        // If locked, cannot submit
        if ($progress->status === 'locked') {
            return redirect()->route('elearning.reception.index')
                ->with('message', 'Latihan ini belum terbuka.')
                ->with('type', 'error');
        }

        // Get latest attempt count
        $latestAnswer = StudentAnswer::where('user_id', $userId)
            ->where('exercise_id', $exercise->id)
            ->latest()
            ->first();

        $attemptCount = ($latestAnswer?->attempt ?? 0) + 1;

        // Validate answer - this will be customized per exercise
        $validationResult = $this->validateAnswer($request, $exercise, $userId);

        // Save answer
        $answer = StudentAnswer::create([
            'user_id' => $userId,
            'exercise_id' => $exercise->id,
            'answers' => $request->all(),
            'score' => $validationResult['score'],
            'is_completed' => $validationResult['is_correct'],
            'attempt' => $attemptCount,
        ]);

        // If correct, mark as completed and unlock next
        if ($validationResult['is_correct']) {
            $progress->markAsCompleted();

            // Unlock next exercise
            $this->unlockNextExercise($userId, $exercise);

            return redirect()->back()->with([
                'message' => 'Jawaban benar! Latihan selesai.',
                'type' => 'success',
                'validation' => $validationResult,
            ]);
        }

        // If wrong, return with clues
        return redirect()->back()->with([
            'message' => 'Ada jawaban yang salah. Silakan coba lagi.',
            'type' => 'error',
            'validation' => $validationResult,
            'wrong_fields' => $validationResult['wrong_fields'],
        ]);
    }

    /**
     * Validate answer based on exercise.
     * Uses ExerciseFormService for validation.
     */
    protected function validateAnswer(Request $request, Exercise $exercise, int $userId): array
    {
        $answers = $request->all();

        // Use ExerciseFormService for validation
        return ExerciseFormService::validateAnswers($exercise->slug, $answers);
    }

    /**
     * Unlock next exercise in the category.
     */
    protected function unlockNextExercise(int $userId, Exercise $currentExercise): void
    {
        // Get next exercise in the same category
        $nextExercise = Exercise::where('category', $currentExercise->category)
            ->where('order_number', '>', $currentExercise->order_number)
            ->orderBy('order_number', 'asc')
            ->first();

        if ($nextExercise) {
            // Unlock next exercise
            StudentProgress::firstOrCreate(
                [
                    'user_id' => $userId,
                    'exercise_id' => $nextExercise->id,
                ],
                [
                    'status' => 'opened',
                ]
            );

            // If it was locked, open it
            StudentProgress::where('user_id', $userId)
                ->where('exercise_id', $nextExercise->id)
                ->where('status', 'locked')
                ->update(['status' => 'opened']);
        } else {
            // Category completed - check if all categories complete
            $this->checkAndUnlockReservation($userId);
        }
    }

    /**
     * Check if reception is complete and unlock reservation.
     */
    protected function checkAndUnlockReservation(int $userId): void
    {
        // Check if all reception exercises are completed
        $receptionExercises = Exercise::reception()->pluck('id');
        $receptionCompleted = StudentProgress::where('user_id', $userId)
            ->whereIn('exercise_id', $receptionExercises)
            ->where('status', 'completed')
            ->count();

        if ($receptionCompleted >= Exercise::reception()->count()) {
            // Unlock first reservation exercise
            $firstReservation = Exercise::reservation()
                ->orderBy('order_number', 'asc')
                ->first();

            if ($firstReservation) {
                StudentProgress::firstOrCreate(
                    [
                        'user_id' => $userId,
                        'exercise_id' => $firstReservation->id,
                    ],
                    [
                        'status' => 'opened',
                    ]
                );

                StudentProgress::where('user_id', $userId)
                    ->where('exercise_id', $firstReservation->id)
                    ->where('status', 'locked')
                    ->update(['status' => 'opened']);
            }
        }
    }

    /**
     * Ensure progress exists for all exercises in a category.
     */
    protected function ensureProgressExists(int $userId, string $category): void
    {
        $exercises = Exercise::where('category', $category)->get();

        foreach ($exercises as $index => $exercise) {
            $progress = StudentProgress::where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->first();

            if (!$progress) {
                // First exercise is always opened, others are locked
                $status = $index === 0 ? 'opened' : 'locked';

                StudentProgress::create([
                    'user_id' => $userId,
                    'exercise_id' => $exercise->id,
                    'status' => $status,
                ]);
            }
        }
    }
}
