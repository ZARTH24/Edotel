<?php

namespace App\Services\Simulation;

use App\Models\FrontOffice\Guest;
use App\Models\FrontOffice\Reservation;
use App\Models\FrontOffice\Room;
use App\Models\HouseKeeping\CleaningTask;
use App\Models\DamageReport\DamageReports;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Session;

/**
 * SimulationService
 *
 * Handles simulation mode for student (siswa) role.
 * All write operations are stored in session instead of database.
 */
class SimulationService
{
    const SESSION_KEY = 'simulation_data';
    const SIMULATION_MODE_KEY = 'is_simulation_mode';

    /**
     * Check if current user is in simulation mode
     */
    public static function isSimulationMode(): bool
    {
        return Session::get(self::SIMULATION_MODE_KEY, false);
    }

    /**
     * Enable simulation mode for a user
     */
    public static function enableSimulation(): void
    {
        Session::put(self::SIMULATION_MODE_KEY, true);
    }

    /**
     * Disable simulation mode
     */
    public static function disableSimulation(): void
    {
        Session::put(self::SIMULATION_MODE_KEY, false);
        self::clearSimulationData();
    }

    /**
     * Clear all simulation data
     */
    public static function clearSimulationData(): void
    {
        Session::forget(self::SESSION_KEY);
    }

    /**
     * Get all simulation data
     */
    public static function getSimulationData(): array
    {
        return Session::get(self::SESSION_KEY, [
            'reservations' => [],
            'checkins' => [],
            'checkouts' => [],
            'cleaning_tasks' => [],
            'damage_reports' => [],
            'guests' => [],
        ]);
    }

    /**
     * Store simulation data
     */
    protected static function storeSimulationData(string $type, array $data): void
    {
        $simulationData = self::getSimulationData();
        $simulationData[$type][] = array_merge($data, [
            'simulated_at' => now()->toIso8601String(),
            'simulation_id' => uniqid('sim_'),
        ]);
        Session::put(self::SESSION_KEY, $simulationData);
    }

    // ============================================
    // RESERVATION SIMULATION
    // ============================================

    /**
     * Simulate reservation creation
     */
    public static function simulateReservation(array $data): array
    {
        $bookingReference = self::generateBookingReference();
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'booking_reference' => $bookingReference,
            'simulation_id' => $simulationId,
            'guest_data' => $data,
            'room_id' => $data['room_id'],
            'check_in' => $data['check_in'],
            'check_out' => $data['check_out'],
            'total_price' => $data['total_price'] ?? 0,
            'status' => 'confirmed',
            'payment_status' => 'pending',
            'is_simulation' => true,
        ];

        self::storeSimulationData('reservations', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate check-in
     */
    public static function simulateCheckin(string $bookingReference): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'booking_reference' => $bookingReference,
            'simulation_id' => $simulationId,
            'action' => 'checkin',
            'checked_in_at' => now()->toIso8601String(),
            'previous_status' => 'confirmed',
            'new_status' => 'checked-in',
            'is_simulation' => true,
        ];

        self::storeSimulationData('checkins', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate check-out
     */
    public static function simulateCheckout(string $bookingReference): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'booking_reference' => $bookingReference,
            'simulation_id' => $simulationId,
            'action' => 'checkout',
            'checked_out_at' => now()->toIso8601String(),
            'previous_status' => 'checked-in',
            'new_status' => 'checked-out',
            'payment_status' => 'paid',
            'is_simulation' => true,
        ];

        self::storeSimulationData('checkouts', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate reservation cancellation
     */
    public static function simulateCancel(string $bookingReference): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'booking_reference' => $bookingReference,
            'simulation_id' => $simulationId,
            'action' => 'cancel',
            'cancelled_at' => now()->toIso8601String(),
            'previous_status' => 'confirmed',
            'new_status' => 'cancelled',
            'is_simulation' => true,
        ];

        self::storeSimulationData('reservations', array_merge($simulationRecord, [
            'type' => 'cancellation',
        ]));

        return $simulationRecord;
    }

    // ============================================
    // CLEANING TASK SIMULATION
    // ============================================

    /**
     * Simulate cleaning task creation
     */
    public static function simulateCleaningTask(array $data): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'task_id' => uniqid('task_'),
            'simulation_id' => $simulationId,
            'room_id' => $data['room_id'],
            'priority' => $data['priority'] ?? 'low',
            'status' => 'pending',
            'is_simulation' => true,
        ];

        self::storeSimulationData('cleaning_tasks', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate cleaning task assignment
     */
    public static function simulateAssignCleaningTask(string $taskId, int $userId): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'task_id' => $taskId,
            'simulation_id' => $simulationId,
            'assigned_to' => $userId,
            'assigned_at' => now()->toIso8601String(),
            'action' => 'assign',
            'is_simulation' => true,
        ];

        self::storeSimulationData('cleaning_tasks', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate cleaning task completion
     */
    public static function simulateCompleteCleaningTask(string $taskId): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'task_id' => $taskId,
            'simulation_id' => $simulationId,
            'completed_at' => now()->toIso8601String(),
            'action' => 'completed',
            'status' => 'completed',
            'is_simulation' => true,
        ];

        self::storeSimulationData('cleaning_tasks', $simulationRecord);

        return $simulationRecord;
    }

    // ============================================
    // DAMAGE REPORT SIMULATION
    // ============================================

    /**
     * Simulate damage report creation
     */
    public static function simulateDamageReport(array $data): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'report_id' => uniqid('damage_'),
            'simulation_id' => $simulationId,
            'room_id' => $data['room_id'],
            'description' => $data['description'],
            'reported_by' => $data['reported_by'] ?? null,
            'status' => 'pending',
            'priority' => $data['priority'] ?? 'medium',
            'is_simulation' => true,
        ];

        self::storeSimulationData('damage_reports', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate damage report approval
     */
    public static function simulateApproveDamageReport(string $reportId): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'report_id' => $reportId,
            'simulation_id' => $simulationId,
            'approved_at' => now()->toIso8601String(),
            'action' => 'approve',
            'status' => 'approved',
            'is_simulation' => true,
        ];

        self::storeSimulationData('damage_reports', $simulationRecord);

        return $simulationRecord;
    }

    /**
     * Simulate damage report completion
     */
    public static function simulateCompleteDamageReport(string $reportId): array
    {
        $simulationId = uniqid('sim_');

        $simulationRecord = [
            'report_id' => $reportId,
            'simulation_id' => $simulationId,
            'completed_at' => now()->toIso8601String(),
            'action' => 'completed',
            'status' => 'completed',
            'is_simulation' => true,
        ];

        self::storeSimulationData('damage_reports', $simulationRecord);

        return $simulationRecord;
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Generate a booking reference
     */
    protected static function generateBookingReference(): string
    {
        return 'SIM-' . strtoupper(substr(uniqid(), -6)) . '-' . date('ymd');
    }

    /**
     * Get simulation summary for display
     */
    public static function getSimulationSummary(): array
    {
        $data = self::getSimulationData();

        return [
            'total_reservations' => count($data['reservations'] ?? []),
            'total_checkins' => count($data['checkins'] ?? []),
            'total_checkouts' => count($data['checkouts'] ?? []),
            'total_cleaning_tasks' => count($data['cleaning_tasks'] ?? []),
            'total_damage_reports' => count($data['damage_reports'] ?? []),
            'simulation_data' => $data,
        ];
    }

    /**
     * Check if user completed E-Learning
     */
    public static function hasCompletedELearning(): bool
    {
        // Check if user has completed both reception and reservation
        $user = auth()->user();
        if (!$user) return false;

        // Check in student_progress table
        $progress = \App\Models\ELearning\StudentProgress::where('user_id', $user->id)->get();

        if ($progress->isEmpty()) return false;

        // Get all reception exercises completed
        $receptionCompleted = $progress->where('is_completed', true)
            ->filter(function ($p) {
                $exercise = \App\Models\ELearning\Exercise::find($p->exercise_id);
                return $exercise && $exercise->category === 'reception';
            })
            ->count();

        // Get all reservation exercises completed
        $reservationCompleted = $progress->where('is_completed', true)
            ->filter(function ($p) {
                $exercise = \App\Models\ELearning\Exercise::find($p->exercise_id);
                return $exercise && $exercise->category === 'reservation';
            })
            ->count();

        $totalReception = \App\Models\ELearning\Exercise::where('category', 'reception')->count();
        $totalReservation = \App\Models\ELearning\Exercise::where('category', 'reservation')->count();

        return $receptionCompleted >= $totalReception && $reservationCompleted >= $totalReservation;
    }
}
