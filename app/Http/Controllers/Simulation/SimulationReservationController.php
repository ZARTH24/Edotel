<?php

namespace App\Http\Controllers\Simulation;

use App\Http\Controllers\Controller;
use App\Http\Requests\FrontOffice\StoreReservationRequest;
use App\Models\FrontOffice\Guest;
use App\Models\FrontOffice\Reservation;
use App\Models\FrontOffice\Room;
use App\Models\HouseKeeping\CleaningTask;
use App\Services\Simulation\SimulationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

/**
 * SimulationReservationController
 *
 * Handles reservation operations for students in simulation mode.
 * All write operations are simulated and stored in session.
 */
class SimulationReservationController extends Controller
{
    /**
     * Create a new reservation (simulation)
     */
    public function store(StoreReservationRequest $request)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        $data = $request->validated();

        try {
            // Calculate total price (simulation)
            $room = Room::findOrFail($data['room_id']);
            $checkIn = Carbon::parse($data['check_in']);
            $checkOut = Carbon::parse($data['check_out']);
            $nights = $checkIn->diffInDays($checkOut) ?: 1;

            $totalMiscPrice = collect($data['miscellaneous'] ?? [])->filter(function ($item) {
                return !empty($item['service']);
            })->reduce(function ($total, $item) {
                return $total + ($item['price'] * ($item['qty'] ?? 1));
            }, 0);

            $roomTotal = $room->price * $nights;
            $grandTotal = $roomTotal + $totalMiscPrice;

            $data['total_price'] = $grandTotal;

            // Simulate reservation
            $simulationResult = SimulationService::simulateReservation($data);

            // Show success message with simulation indicator
            return redirect('/Frontoffice')->with([
                'message' => '✅ Reservation berhasil DISIMULASIKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation reservation error: ' . $e->getMessage());
            return back()->with([
                'message' => 'Error simulasi: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Update reservation (simulation)
     */
    public function update(StoreReservationRequest $request, Reservation $reservation)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        // For simulation, just show a success message
        // We don't actually update anything in the database
        return redirect('/Frontoffice')->with([
            'message' => '✅ Reservation berhasil DIUPDATE! (Simulation Mode)',
            'type' => 'success',
            'is_simulation' => true,
        ]);
    }

    /**
     * Check-in simulation
     */
    public function checkin(Reservation $reservation)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            // Validate like the real controller
            if ($reservation->status !== 'confirmed') {
                return redirect()->back()->with([
                    'message' => 'Only confirmed reservations can check in.',
                    'type' => 'error',
                ]);
            }

            // Simulate check-in
            $simulationResult = SimulationService::simulateCheckin($reservation->booking_reference);

            return redirect()->back()->with([
                'message' => '✅ Check-in berhasil DISIMULASIKAN! Kamar ' . $reservation->room->number . ' (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation checkin error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi check-in: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Check-out simulation
     */
    public function checkout(Reservation $reservation)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            if ($reservation->status !== 'checked-in') {
                return redirect()->back()->with([
                    'message' => 'Guest has not checked in yet.',
                    'type' => 'error',
                ]);
            }

            // Simulate check-out
            $simulationResult = SimulationService::simulateCheckout($reservation->booking_reference);

            return redirect()->back()->with([
                'message' => '✅ Check-out berhasil DISIMULASIKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation checkout error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi check-out: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Cancel reservation (simulation)
     */
    public function cancel(Reservation $reservation)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            if (in_array($reservation->status, ['checked-in', 'checked-out'])) {
                return redirect()->back()->with([
                    'message' => 'Cannot cancel: Guest has already checked in or the stay is completed.',
                    'type' => 'error',
                ]);
            }

            // Simulate cancellation
            $simulationResult = SimulationService::simulateCancel($reservation->booking_reference);

            return redirect()->back()->with([
                'message' => '✅ Reservation berhasil DIBATALKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation cancel error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi cancel: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Check if simulation mode is active
     */
    protected function isSimulationMode(): bool
    {
        return SimulationService::isSimulationMode();
    }
}
