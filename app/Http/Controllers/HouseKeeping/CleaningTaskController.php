<?php

namespace App\Http\Controllers\HouseKeeping;

use App\Http\Controllers\Controller;
use App\Http\Requests\HouseKeeping\CleaningTaskRequest;
use App\Models\FrontOffice\Room;
use App\Models\HouseKeeping\CleaningTask;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CleaningTaskController extends Controller
{
    public function store(CleaningTaskRequest $request)
    {
        $data = $request->validated();

        // Cek apakah room sedang dalam status maintenance
        $room = Room::findOrFail($data['room_id']);
        if ($room->status === 'maintenance') {
            return back()->with([
                'message' => 'This room is currently under maintenance.',
                'type' => 'error',
            ]);
        }

        // Cek apakah sudah ada cleaning task aktif untuk room ini
        $existingTask = CleaningTask::where('room_id', $data['room_id'])
            ->whereIn('status', ['pending', 'in-progress'])
            ->first();

        if ($existingTask) {
            return back()->withErrors([
                'room_id' => 'This room already has an active cleaning task.'
            ]);
        }

        DB::transaction(function () use ($data, $room) {

            // Create cleaning task
            $task = CleaningTask::create([
                ...$data,
                'status' => 'pending', // pastikan default
            ]);

            // Update room status → cleaning
            $room->update([
                'status' => 'cleaning',
            ]);
        });

        return back()->with([
            'message' => 'Cleaning task created successfully',
            'type' => 'success',
        ]);
    }

    public function assignCleaningTask(Request $request, CleaningTask $task)
    {
        // 1. Validasi input
        $data = $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        // 2. Cek status task
        if (!in_array($task->status, ['pending'])) {
            return back()->with([
                'message' => 'This task cannot be started.',
                'type' => 'error',
            ]);
        }

        DB::transaction(function () use ($task, $data) {
            // 3. Assign staff & update task
            $task->update([
                'assigned_to' => $data['assigned_to'],
                'status' => 'in-progress', // langsung jadi in-progress
                'start_time' => now(),
            ]);

            // 4. Update status room menjadi cleaning
            $task->room->update([
                'status' => 'cleaning',
            ]);
        });

        return back()->with([
            'message' => 'Cleaning task started successfully.',
            'type' => 'success',
        ]);
    }

    public function completedCleaningTask(Request $request, CleaningTask $task)
    {
        // Pastikan hanya task yang sedang dikerjakan yang bisa diselesaikan
        if ($task->status !== 'in-progress') {
            return back()->with([
                'message' => 'This task cannot be completed.',
                'type' => 'error',
            ]);
        }

        DB::transaction(function () use ($task) {

            // Update cleaning task → completed
            $task->update([
                'status' => 'completed',
                'end_time' => now(),
            ]);

            //Room tetap cleaning (belum available)
            $task->room->update([
                'status' => 'cleaning',
            ]);
        });

        return back()->with([
            'message' => 'Cleaning task completed. Waiting for inspection.',
            'type' => 'success',
        ]);
    }

    public function inspectCleaningTask(Request $request, CleaningTask $task)
    {
        // Cek apakah task sudah completed
        if ($task->status !== 'completed') {
            return back()->with([
                'message' => 'Task must be completed before inspection.',
                'type' => 'error',
            ]);
        }

        // Validasi jika admin memilih inspector
        $data = $request->validate([
            'inspected_by' => 'nullable|exists:users,id',
        ]);

        DB::transaction(function () use ($task, $data) {
            // Tentukan user yang inspeksi: jika ada input dari form (admin), pakai itu
            // jika tidak (non-admin), pakai auth()->id()
            $inspectorId = $data['inspected_by'] ?? Auth::id();

            // Update task jadi inspected
            $task->update([
                'status' => 'inspected',
                'inspected_by' => $inspectorId,
                'inspected_at' => now(),
            ]);

            // Update room jadi available
            $task->room->update([
                'status' => 'available',
            ]);
        });

        return back()->with([
            'message' => 'Room inspected and ready.',
            'type' => 'success',
        ]);
    }
}
