<?php

namespace App\Http\Controllers\Simulation;

use App\Http\Controllers\Controller;
use App\Models\DamageReport\DamageReports;
use App\Services\Simulation\SimulationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * SimulationDamageReportController
 *
 * Handles damage report operations for students in simulation mode.
 */
class SimulationDamageReportController extends Controller
{
    /**
     * Create damage report (simulation)
     */
    public function store(Request $request)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            $simulationResult = SimulationService::simulateDamageReport([
                'room_id' => $request->room_id,
                'description' => $request->description,
                'reported_by' => auth()->id(),
                'priority' => $request->priority ?? 'medium',
            ]);

            return redirect()->back()->with([
                'message' => '✅ Damage Report berhasil DICIPTAKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation damage report error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Approve damage report (simulation)
     */
    public function approve(DamageReports $damageReport)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            $simulationResult = SimulationService::simulateApproveDamageReport((string) $damageReport->id);

            return redirect()->back()->with([
                'message' => '✅ Damage Report berhasil DIAPPROVE! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation approve error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Assign damage report (simulation)
     */
    public function assign(Request $request, DamageReports $damageReport)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        return redirect()->back()->with([
            'message' => '✅ Damage Report berhasil DITUGASKAN! (Simulation Mode)',
            'type' => 'success',
            'is_simulation' => true,
        ]);
    }

    /**
     * Complete damage report (simulation)
     */
    public function complete(DamageReports $damageReport)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            $simulationResult = SimulationService::simulateCompleteDamageReport((string) $damageReport->id);

            return redirect()->back()->with([
                'message' => '✅ Damage Report berhasil DISELESAIKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation complete error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi: ' . $e->getMessage(),
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
