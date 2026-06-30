<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentProgress;
use App\Models\FrontOffice\Reservation;
use App\Models\FrontOffice\Room;
use App\Models\User;
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

        // E-Learning Progress
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

        return inertia('Dashboard/Index', compact('rooms', 'elearningStats'));
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
        $housekeepingUsers = User::where('role', 'housekeeping')->get();
        $adminUsers = User::where('role', 'admin')->get();
        $rooms = Room::orderBy('number', 'asc')->with(['cleaningTasks.assign', 'cleaningTasks.inspect', 'maintenanceTasks'])->get();

        $users = User::whereIn('role', ['housekeeping'])
            ->withCount([
                'assignedTasks as pending' => fn($q) => $q->where('status', 'pending'),
                'assignedTasks as in_progress' => fn($q) => $q->where('status', 'in-progress'),
                'assignedTasks as completed' => fn($q) => $q->whereIn('status', ['completed', 'inspected']),
            ])
            ->with([
                'assignedTasks' => fn($q) => $q->with('room')->whereIn('status', ['pending', 'in-progress'])
            ])
            ->get();
        return inertia("HouseKeeping/Index", compact('rooms', 'housekeepingUsers', 'adminUsers', 'users'));
    }

    public function landingpage()
    {
        return inertia('LandingPage/Index');
    }
}
