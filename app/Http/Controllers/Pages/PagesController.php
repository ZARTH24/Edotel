<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentProgress;
use App\Models\FrontOffice\Reservation;
use App\Models\FrontOffice\Room;
use App\Models\User;
use App\Services\Simulation\SimulationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PagesController extends Controller
{
    public function dashboard()
    {
        $userId = Auth::id();

        $rooms = Room::with([
            'reservations',
            'reservations.guest',
            'cleaningTasks',
            'maintenanceTasks',
        ])->orderBy('number')->get();

        // E-Learning Progress for current user
        $receptionExercises = Exercise::reception()->get();
        $reservationExercises = Exercise::reservation()->get();

        $receptionTotal = $receptionExercises->count();
        $receptionCompleted = StudentProgress::where('user_id', $userId)
            ->whereIn('exercise_id', $receptionExercises->pluck('id'))
            ->where('status', 'completed')
            ->count();
        $receptionProgress = $receptionTotal > 0 ? round(($receptionCompleted / $receptionTotal) * 100) : 0;

        $reservationTotal = $reservationExercises->count();
        $reservationCompleted = StudentProgress::where('user_id', $userId)
            ->whereIn('exercise_id', $reservationExercises->pluck('id'))
            ->where('status', 'completed')
            ->count();
        $reservationProgress = $reservationTotal > 0 ? round(($reservationCompleted / $reservationTotal) * 100) : 0;

        $totalExercises = $receptionTotal + $reservationTotal;
        $totalCompleted = $receptionCompleted + $reservationCompleted;
        $totalProgress = $totalExercises > 0 ? round(($totalCompleted / $totalExercises) * 100) : 0;

        $elearningStats = [
            'reception_total' => $receptionTotal,
            'reception_completed' => $receptionCompleted,
            'reception_progress' => $receptionProgress,
            'reservation_total' => $reservationTotal,
            'reservation_completed' => $reservationCompleted,
            'reservation_progress' => $reservationProgress,
            'total_exercises' => $totalExercises,
            'total_completed' => $totalCompleted,
            'total_progress' => $totalProgress,
            'remaining' => $totalExercises - $totalCompleted,
        ];

        // Student Summary Stats for Admin
        $user = Auth::user();
        $studentStats = null;

        if ($user->role === 'admin') {
            $allStudents = User::where('role', 'siswa')->get();
            $totalStudents = $allStudents->count();

            $studentProgressData = $allStudents->map(function ($student) use ($receptionExercises, $reservationExercises) {
                $receptionDone = StudentProgress::where('user_id', $student->id)
                    ->whereIn('exercise_id', $receptionExercises->pluck('id'))
                    ->where('status', 'completed')
                    ->count();
                $reservationDone = StudentProgress::where('user_id', $student->id)
                    ->whereIn('exercise_id', $reservationExercises->pluck('id'))
                    ->where('status', 'completed')
                    ->count();
                $totalExercises = $receptionExercises->count() + $reservationExercises->count();
                $totalDone = $receptionDone + $reservationDone;
                $progress = $totalExercises > 0 ? round(($totalDone / $totalExercises) * 100) : 0;

                return [
                    'reception_completed' => $receptionDone,
                    'reception_total' => $receptionExercises->count(),
                    'reservation_completed' => $reservationDone,
                    'reservation_total' => $reservationExercises->count(),
                    'total_completed' => $totalDone,
                    'total_exercises' => $totalExercises,
                    'progress' => $progress,
                    'is_done' => $totalDone >= $totalExercises && $totalExercises > 0,
                ];
            });

            $selesaiCount = $studentProgressData->where('is_done', true)->count();
            $belumSelesaiCount = $totalStudents - $selesaiCount;
            $avgReceptionProgress = $totalStudents > 0 ? round($studentProgressData->avg('reception_completed') / max($receptionExercises->count(), 1) * 100) : 0;
            $avgReservationProgress = $totalStudents > 0 ? round($studentProgressData->avg('reservation_completed') / max($reservationExercises->count(), 1) * 100) : 0;
            $avgTotalProgress = $totalStudents > 0 ? round($studentProgressData->avg('progress')) : 0;

            $studentStats = [
                'total_siswa' => $totalStudents,
                'siswa_selesai' => $selesaiCount,
                'siswa_belum_selesai' => $belumSelesaiCount,
                'avg_reception_progress' => $avgReceptionProgress,
                'avg_reservation_progress' => $avgReservationProgress,
                'avg_total_progress' => $avgTotalProgress,
            ];
        }

        return inertia('Dashboard/Index', compact('rooms', 'elearningStats', 'studentStats'));
    }

    public function frontoffice(Request $request)
    {
        $search = $request->input('search');
        $historySearch = $request->input('historySearch');
        $guestSearch = $request->input('guestSearch');
        $year = $request->input('year', now()->year);
        $month = $request->input('month', 'all');

        // --- 1. TAB ALL RESERVATIONS (Aktif) ---
        $reservations = Reservation::with(['guest', 'room'])
            ->whereIn('status', ['confirmed', 'checked-in'])
            ->search($search)
            ->latest()
            ->get();

        // --- 2. TAB GUESTS ---
        $guestsQuery = Reservation::with(['guest', 'room'])
            ->whereHas('guest')
            ->search($guestSearch)
            ->latest()
            ->get();

        // --- 3. TAB HISTORY ---
        $historyQuery = Reservation::with(['guest', 'room'])
            ->whereIn('status', ['checked-out', 'cancelled'])
            ->whereYear('check_in', $year)
            ->search($historySearch);

        if ($month && $month !== 'all') {
            $historyQuery->whereMonth('check_in', $month);
        }

        $historyData = $historyQuery->latest()->paginate(10)->withQueryString();

        // --- 4. STATISTIK ---
        $statBase = Reservation::whereIn('status', ['checked-out', 'cancelled'])
            ->whereYear('check_in', $year)
            ->search($historySearch);
        if ($month !== 'all') $statBase->whereMonth('check_in', $month);

        $allHistoryForStats = $statBase->get();

        $stats = [
            'totalReservations' => $allHistoryForStats->count(),
            'totalRevenue'      => (float) $allHistoryForStats->where('status', 'checked-out')->sum('total_price'),
            'checkedOut'        => $allHistoryForStats->where('status', 'checked-out')->count(),
            'cancelled'         => $allHistoryForStats->where('status', 'cancelled')->count(),
        ];

        // --- 5. DATA PENDUKUNG ---
        $availableYears = range(now()->year, now()->year - 1);
        $monthsList = collect(range(1, 12))->map(fn($m) => [
            'value' => str_pad($m, 2, '0', STR_PAD_LEFT),
            'label' => date('F', mktime(0, 0, 0, $m, 1))
        ])->prepend(['value' => 'all', 'label' => 'All Months']);

        $tab = $request->input('tab', 'reservations');

        // --- 6. CHECK SIMULATION MODE - merge simulation data ---
        $user = auth()->user();
        $isSimulation = SimulationService::isSimulationMode() || ($user && $user->role === 'siswa' && $user->is_menu_unlocked);

        if ($isSimulation) {
            $simulationData = SimulationService::getSimulationData();

            // Add simulated reservations
            $simulatedReservations = $simulationData['reservations'] ?? [];
            foreach ($simulatedReservations as $simRes) {
                if (in_array($simRes['status'] ?? '', ['confirmed', 'checked-in'])) {
                    $room = Room::find($simRes['room_id']);
                    $reservations->push((object)[
                        'id' => uniqid('sim_'),
                        'booking_reference' => $simRes['booking_reference'] ?? null,
                        'room_id' => $simRes['room_id'],
                        'check_in' => $simRes['check_in'],
                        'check_out' => $simRes['check_out'],
                        'total_price' => $simRes['total_price'] ?? 0,
                        'total_price_rupiah' => 'Rp ' . number_format($simRes['total_price'] ?? 0, 0, ',', '.'),
                        'status' => $simRes['status'],
                        'payment_status' => $simRes['payment_status'] ?? 'pending',
                        'number_of_guests' => 1,
                        'is_simulated' => true,
                        'simulated_at' => $simRes['simulated_at'] ?? null,
                        'guest' => (object)[
                            'id' => uniqid('sim_guest_'),
                            'name' => $simRes['guest_data']['name'] ?? 'Simulated Guest',
                            'email' => $simRes['guest_data']['email'] ?? null,
                            'phone' => $simRes['guest_data']['phone'] ?? null,
                        ],
                        'room' => $room,
                    ]);
                }
            }
        }

        return inertia("FrontOffice/Index", [
            'rooms' => Room::orderBy('number', 'asc')->get(),
            'archivedRooms' => Room::onlyTrashed()->orderBy('number', 'asc')->get(),
            'reservations' => $reservations,
            'guests' => $guestsQuery,
            'historyData' => $historyData,
            'stats' => $stats,
            'filters' => [
                'tab' => $tab,
                'search' => $search,
                'historySearch' => $historySearch,
                'guestSearch' => $guestSearch,
                'year' => (string) $year,
                'month' => $month,
            ],
            'availableYears' => $availableYears,
            'months' => $monthsList,
        ]);
    }

    public function housekeeping()
    {
        // Untuk sistem 2 role (admin & siswa), housekeeping staff adalah admin
        $housekeepingUsers = User::where('role', 'admin')->get();
        $adminUsers = User::where('role', 'admin')->get();
        $rooms = Room::orderBy('number', 'asc')->with(['cleaningTasks.assign', 'cleaningTasks.inspect', 'maintenanceTasks'])->get();

        // Admin mengelola cleaning tasks
        $users = User::where('role', 'admin')
            ->withCount([
                'assignedTasks as pending' => fn($q) => $q->where('status', 'pending'),
                'assignedTasks as in_progress' => fn($q) => $q->where('status', 'in-progress'),
                'assignedTasks as completed' => fn($q) => $q->whereIn('status', ['completed', 'inspected']),
            ])
            ->with([
                'assignedTasks' => fn($q) => $q->with('room')->whereIn('status', ['pending', 'in-progress'])
            ])
            ->get();

        // Check if simulation mode is active - merge simulation data
        $user = auth()->user();
        $isSimulation = SimulationService::isSimulationMode() || ($user && $user->role === 'siswa' && $user->is_menu_unlocked);

        if ($isSimulation) {
            $simulationData = SimulationService::getSimulationData();
            $simulatedTasks = $simulationData['cleaning_tasks'] ?? [];

            // Add simulated tasks to rooms
            foreach ($rooms as $room) {
                $roomCleaningTasks = $room->cleaningTasks->toArray();
                foreach ($simulatedTasks as $simTask) {
                    if ($simTask['room_id'] == $room->id) {
                        $roomCleaningTasks[] = [
                            'id' => $simTask['task_id'] ?? uniqid('sim_'),
                            'room_id' => $simTask['room_id'],
                            'priority' => $simTask['priority'] ?? 'low',
                            'status' => $simTask['status'] ?? 'pending',
                            'assigned_to' => $simTask['assigned_to'] ?? null,
                            'is_simulated' => true,
                            'simulated_at' => $simTask['simulated_at'] ?? null,
                        ];
                    }
                }
                $room->setRelation('cleaningTasks', collect($roomCleaningTasks));
            }
        }

        return inertia("HouseKeeping/Index", compact('rooms', 'housekeepingUsers', 'adminUsers', 'users'));
    }

    public function landingpage()
    {
        return inertia('LandingPage/Index');
    }
}
