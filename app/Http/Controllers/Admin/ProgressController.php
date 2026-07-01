<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentProgress;
use App\Models\ELearning\StudentAnswer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    /**
     * Display list of all students with progress overview.
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'siswa');

        // Search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by class
        if ($request->has('kelas') && $request->kelas && $request->kelas !== 'all') {
            $query->where('kelas', $request->kelas);
        }

        $students = $query->orderBy('name')->get();

        // Get all exercises
        $receptionExercises = Exercise::reception()->ordered()->get();
        $reservationExercises = Exercise::reservation()->ordered()->get();

        // Calculate progress for each student
        $studentsWithProgress = $students->map(function ($student) use ($receptionExercises, $reservationExercises) {
            $receptionCompleted = 0;
            $reservationCompleted = 0;

            foreach ($receptionExercises as $exercise) {
                $progress = StudentProgress::where('user_id', $student->id)
                    ->where('exercise_id', $exercise->id)
                    ->first();
                if ($progress && $progress->status === 'completed') {
                    $receptionCompleted++;
                }
            }

            foreach ($reservationExercises as $exercise) {
                $progress = StudentProgress::where('user_id', $student->id)
                    ->where('exercise_id', $exercise->id)
                    ->first();
                if ($progress && $progress->status === 'completed') {
                    $reservationCompleted++;
                }
            }

            $totalExercises = $receptionExercises->count() + $reservationExercises->count();
            $totalCompleted = $receptionCompleted + $reservationCompleted;
            $totalProgress = $totalExercises > 0 ? round(($totalCompleted / $totalExercises) * 100) : 0;

            // Determine status
            if ($totalCompleted == 0) {
                $status = 'Belum Mulai';
            } elseif ($totalCompleted >= $totalExercises) {
                $status = 'Selesai';
            } else {
                $status = 'Sedang Belajar';
            }

            return [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'kelas' => $student->kelas ?? '-',
                'nisn' => $student->nisn ?? '-',
                'reception_completed' => $receptionCompleted,
                'reception_total' => $receptionExercises->count(),
                'reception_progress' => $receptionExercises->count() > 0 ? round(($receptionCompleted / $receptionExercises->count()) * 100) : 0,
                'reservation_completed' => $reservationCompleted,
                'reservation_total' => $reservationExercises->count(),
                'reservation_progress' => $reservationExercises->count() > 0 ? round(($reservationCompleted / $reservationExercises->count()) * 100) : 0,
                'total_completed' => $totalCompleted,
                'total_exercises' => $totalExercises,
                'total_progress' => $totalProgress,
                'status' => $status,
                'is_menu_unlocked' => $student->is_menu_unlocked ?? false,
            ];
        });

        // Get unique kelas for filter
        $kelasList = User::where('role', 'siswa')
            ->whereNotNull('kelas')
            ->where('kelas', '!=', '')
            ->distinct()
            ->pluck('kelas')
            ->sort()
            ->values();

        // Summary stats
        $totalSiswa = $studentsWithProgress->count();
        $selesaiCount = $studentsWithProgress->where('status', 'Selesai')->count();
        $belumSelesaiCount = $totalSiswa - $selesaiCount;
        $avgProgress = $totalSiswa > 0 ? round($studentsWithProgress->avg('total_progress')) : 0;

        return inertia('Admin/ProgressSiswa/Index', [
            'students' => $studentsWithProgress,
            'filters' => [
                'search' => $request->search ?? '',
                'kelas' => $request->kelas ?? 'all',
            ],
            'kelasList' => $kelasList,
            'stats' => [
                'total_siswa' => $totalSiswa,
                'selesai' => $selesaiCount,
                'belum_selesai' => $belumSelesaiCount,
                'avg_progress' => $avgProgress,
            ],
        ]);
    }

    /**
     * Display detailed progress for a specific student.
     */
    public function show($studentId)
    {
        $student = User::where('role', 'siswa')->findOrFail($studentId);

        // Get reception exercises with progress
        $receptionExercises = Exercise::reception()->ordered()->get()->map(function ($exercise) use ($studentId) {
            $progress = StudentProgress::where('user_id', $studentId)
                ->where('exercise_id', $exercise->id)
                ->first();
            $answer = StudentAnswer::where('user_id', $studentId)
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
                'attempt' => $answer?->attempt ?? 0,
                'score' => $answer?->score ?? 0,
            ];
        });

        // Get reservation exercises with progress
        $reservationExercises = Exercise::reservation()->ordered()->get()->map(function ($exercise) use ($studentId) {
            $progress = StudentProgress::where('user_id', $studentId)
                ->where('exercise_id', $exercise->id)
                ->first();
            $answer = StudentAnswer::where('user_id', $studentId)
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
                'attempt' => $answer?->attempt ?? 0,
                'score' => $answer?->score ?? 0,
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
        $totalProgress = $totalExercises > 0 ? round(($totalCompleted / $totalExercises) * 100) : 0;

        return inertia('Admin/ProgressSiswa/Detail', [
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'kelas' => $student->kelas ?? '-',
                'nisn' => $student->nisn ?? '-',
                'is_menu_unlocked' => $student->is_menu_unlocked ?? false,
                'unlocked_at' => $student->unlocked_at,
            ],
            'receptionExercises' => $receptionExercises,
            'reservationExercises' => $reservationExercises,
            'stats' => [
                'reception_progress' => $receptionProgress,
                'reception_completed' => $receptionCompleted,
                'reception_in_progress' => $receptionInProgress,
                'reception_total' => $receptionTotal,
                'reservation_progress' => $reservationProgress,
                'reservation_completed' => $reservationCompleted,
                'reservation_in_progress' => $reservationInProgress,
                'reservation_total' => $reservationTotal,
                'total_progress' => $totalProgress,
                'total_completed' => $totalCompleted,
                'total_exercises' => $totalExercises,
            ],
        ]);
    }

    /**
     * Display submitted forms from students.
     */
    public function submittedForms(Request $request)
    {
        // Get all student answers that have been completed
        $query = StudentAnswer::with(['user', 'exercise'])
            ->where('is_completed', true)
            ->orderBy('updated_at', 'desc');

        // Filter by student
        if ($request->has('student_id') && $request->student_id && $request->student_id !== 'all') {
            $query->where('user_id', $request->student_id);
        }

        // Filter by category
        if ($request->has('category') && $request->category && $request->category !== 'all') {
            $query->whereHas('exercise', function($q) use ($request) {
                $q->where('category', $request->category);
            });
        }

        // Filter by form name
        if ($request->has('form') && $request->form && $request->form !== 'all') {
            $query->whereHas('exercise', function($q) use ($request) {
                $q->where('title', 'like', "%{$request->form}%");
            });
        }

        $answers = $query->paginate(20)->withQueryString();

        // Get students for filter
        $students = User::where('role', 'siswa')
            ->orderBy('name')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'kelas' => $student->kelas ?? '-',
                ];
            });

        // Get forms for filter
        $forms = Exercise::orderBy('category')
            ->orderBy('order_number')
            ->get()
            ->map(function ($exercise) {
                return [
                    'id' => $exercise->id,
                    'title' => $exercise->title,
                    'category' => $exercise->category,
                ];
            });

        $submittedForms = $answers->map(function ($answer) {
            return [
                'id' => $answer->id,
                'student_id' => $answer->user_id,
                'student_name' => $answer->user->name ?? 'Unknown',
                'student_kelas' => $answer->user->kelas ?? '-',
                'student_nisn' => $answer->user->nisn ?? '-',
                'exercise_id' => $answer->exercise_id,
                'exercise_title' => $answer->exercise->title ?? 'Unknown',
                'exercise_category' => $answer->exercise->category ?? '-',
                'answers' => $answer->answers,
                'score' => $answer->score,
                'attempt' => $answer->attempt,
                'submitted_at' => $answer->updated_at,
            ];
        });

        return inertia('Admin/ProgressSiswa/HasilForm', [
            'submittedForms' => [
                'data' => $submittedForms,
                'current_page' => $answers->currentPage(),
                'last_page' => $answers->lastPage(),
                'per_page' => $answers->perPage(),
                'total' => $answers->total(),
            ],
            'students' => $students,
            'forms' => $forms,
            'filters' => [
                'student_id' => $request->student_id ?? 'all',
                'category' => $request->category ?? 'all',
                'form' => $request->form ?? 'all',
            ],
        ]);
    }
}
