<?php

namespace App\Http\Controllers\Simulation;

use App\Http\Controllers\Controller;
use App\Models\HouseKeeping\CleaningTask;
use App\Services\Simulation\SimulationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * SimulationCleaningTaskController
 *
 * Handles cleaning task operations for students in simulation mode.
 */
class SimulationCleaningTaskController extends Controller
{
    /**
     * Create cleaning task (simulation)
     */
    public function store(Request $request)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            $simulationResult = SimulationService::simulateCleaningTask([
                'room_id' => $request->room_id,
                'priority' => $request->priority ?? 'low',
            ]);

            return redirect()->back()->with([
                'message' => '✅ Cleaning Task berhasil DICIPTAKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation cleaning task error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Assign cleaning task (simulation)
     */
    public function assignCleaningTask(Request $request, CleaningTask $task)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            $simulationResult = SimulationService::simulateAssignCleaningTask(
                (string) $task->id,
                $request->assigned_to
            );

            return redirect()->back()->with([
                'message' => '✅ Task berhasil DITUGASKAN! (Simulation Mode)',
                'type' => 'success',
                'is_simulation' => true,
                'simulation_id' => $simulationResult['simulation_id'],
            ]);
        } catch (\Exception $e) {
            Log::error('Simulation assign error: ' . $e->getMessage());
            return redirect()->back()->with([
                'message' => 'Error simulasi: ' . $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    /**
     * Complete cleaning task (simulation)
     */
    public function completedCleaningTask(CleaningTask $task)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        try {
            $simulationResult = SimulationService::simulateCompleteCleaningTask((string) $task->id);

            return redirect()->back()->with([
                'message' => '✅ Task berhasil DISELESAIKAN! (Simulation Mode)',
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
     * Inspect cleaning task (simulation)
     */
    public function inspectCleaningTask(CleaningTask $task)
    {
        if (!$this->isSimulationMode()) {
            abort(403, 'Simulation mode is not enabled.');
        }

        return redirect()->back()->with([
            'message' => '✅ Task berhasil DIINSPEKSI! (Simulation Mode)',
            'type' => 'success',
            'is_simulation' => true,
        ]);
    }

    /**
     * Check if simulation mode is active
     */
    protected function isSimulationMode(): bool
    {
        return SimulationService::isSimulationMode();
    }
}
