<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Http\Requests\DamageReport\DamageReportRequest;
use App\Models\DamageReport\DamageReports;
use App\Models\FrontOffice\Room;
use App\Models\User;
use App\Exports\DamageReportsExport;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class DamageReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. Tangkap Filter dari Request (Default ke tahun & bulan sekarang)
        $year = $request->input('year', now()->year);
        $month = $request->input('month', 'all');
        $tab = $request->input('tab', 'alldamage');

        // 2. Data untuk Tab "New Damage Report" (Status Aktif)
        $activeMaintenances = DamageReports::with(['room', 'assign'])
            ->whereIn('status', ['pending', 'in-progress'])
            ->latest()
            ->get();

        // 3. Data untuk Tab "History Damage" (Status Completed/Cancelled + Pagination)
        $historyQuery = DamageReports::with(['room', 'assign'])
            ->whereIn('status', ['completed', 'cancelled'])
            ->whereYear('reported_at', $year);

        if ($month !== 'all') {
            $historyQuery->whereMonth('reported_at', $month);
        }

        // Gunakan paginate agar link pagination di React muncul
        $historyMaintenances = $historyQuery->latest()->paginate(10)->withQueryString();

        // 4. Hitung Statistik History (Berdasarkan Filter yang dipilih)
        $statsData = DamageReports::whereIn('status', ['completed', 'cancelled'])
            ->whereYear('reported_at', $year)
            ->when($month !== 'all', fn($q) => $q->whereMonth('reported_at', $month))
            ->get();

        $historyStats = [
            'totalRequests' => $statsData->count(),
            'totalCost'     => (float) $statsData->sum('actual_cost'),
            'avgCost'       => $statsData->count() > 0 ? (float) $statsData->avg('actual_cost') : 0,
        ];

        // 5. Generate Daftar Tahun (5 tahun terakhir)
        $availableYears = range(now()->year, now()->year - 5);

        // 6. Generate Daftar Bulan (Bahasa Inggris)
        $months = collect(range(1, 12))->map(fn($m) => [
            'value' => str_pad($m, 2, '0', STR_PAD_LEFT),
            'label' => Carbon::createFromFormat('m', $m)->format('F'),
        ])->prepend(['value' => 'all', 'label' => 'All Months']);

        return inertia('DamageReport/Index', [
            'maintenances'        => $activeMaintenances, // Untuk tab aktif
            'historyMaintenances' => $historyMaintenances, // Untuk tab history (Object Pagination)
            'rooms'               => Room::where('status', '!=', 'maintenance')->get(),
            'historyStats'        => $historyStats,
            'availableYears'      => $availableYears,
            'months'              => $months,
            'filters'             => [
                'year'  => (string) $year,
                'month' => $month,
                'tab'   => $tab,
            ],
        ]);
    }

    public function store(DamageReportRequest $request)
    {
        $data = $request->validated();
        $data['reported_at'] = now();
        $data['reported_by'] = auth()->user()->name;

        DB::transaction(function () use ($data) {

            if ($data['lokasi'] === 'room') {

                $existingTask = DamageReports::where('room_id', $data['room_id'])
                    ->whereIn('status', ['pending', 'in-progress'])
                    ->first();

                if ($existingTask) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'room_id' => 'This room already has an active maintenance task.'
                    ]);
                }

                $room = Room::findOrFail($data['room_id']);
                $room->update([
                    'status' => 'maintenance',
                ]);
            }

            DamageReports::create($data);
        });

        return redirect('/Damagereport')->with([
            'message' => 'Maintenance request created successfully!',
            'type' => 'success'
        ]);
    }

    public function show($id)
    {
        // Load maintenance beserta relasi room-nya
        $maintenance = DamageReports::with('room')->findOrFail($id);

        // Format data rupiah agar siap tampil di frontend (opsional jika belum ada di model)
        $maintenance->estimated_rupiah = 'Rp ' . number_format($maintenance->estimated_cost, 0, ',', '.');
        $maintenance->actual_rupiah = $maintenance->actual_cost
            ? 'Rp ' . number_format($maintenance->actual_cost, 0, ',', '.')
            : 'Rp 0';

        $manager = User::where('role', 'admin')->first();

        return inertia('DamageReport/Detail', [
            'maintenance' => $maintenance,
            'manager' => $manager,
        ]);
    }

    public function approve($id)
    {
        // Ambil task berdasarkan route param $id
        $task = DamageReports::findOrFail($id);

        // Cek apakah task bisa di-start
        if (!in_array($task->status, ['pending'])) {
            return back()->with([
                'message' => 'This maintenance task cannot be started.',
                'type' => 'error',
            ]);
        }

        DB::transaction(function () use ($task) {
            // Update status task menjadi in-progress dan set started_at
            $task->update([
                'status' => 'in-progress',
                'started_at' => now(), // pastikan field started_at ada di table
            ]);

            // Update room status ke maintenance jika room_id ada
            if (!is_null($task->room_id)) {
                $room = $task->room;
                if ($room) {
                    $room->update([
                        'status' => 'maintenance',
                    ]);
                }
            }
        });

        return back()->with([
            'message' => 'Maintenance task started successfully.',
            'type' => 'success',
        ]);
    }

    public function complete(Request $request)
    {
        $request->validate([
            'resolution_notes' => 'required|string|max:1000',
            'actual_cost' => 'nullable|numeric|min:0',
        ]);

        $damagereport = DamageReports::findOrFail($request->id);

        if ($damagereport->status !== 'in-progress') {
            return back()->with([
                'message' => 'Damage Report is not currently in progress.',
                'type' => 'error'
            ]);
        }

        // 1. UPDATE DATA LAPORAN (Berlaku untuk Room maupun Public Area)
        $damagereport->status = "completed";
        $damagereport->completed_at = now();
        $damagereport->resolution_notes = $request->resolution_notes;
        $damagereport->actual_cost = $request->actual_cost;
        $damagereport->save();

        // 2. LOGIKA KHUSUS JIKA LAPORAN ADALAH MILIK KAMAR
        // Cek apakah room_id tersedia (tidak null)
        if ($damagereport->room_id) {
            $room = Room::find($damagereport->room_id);

            if ($room) {
                $room->status = "available";
                $room->save();
            }
        }
        // Jika room_id null, kode di atas akan dilewati (tidak akan Not Found)

        return redirect()->route('DamageReport')->with([
            'message' => 'Damage Report completed successfully!',
            'type' => 'success'
        ]);
    }

    public function assign(Request $request, $id)
    {
        $request->validate([
            'assigned_to' => 'required|exists:users,id',
        ]);

        $task = DamageReports::findOrFail($id);

        if (!in_array($task->status, ['pending', 'in-progress'])) {
            return back()->with([
                'message' => 'Cannot assign staff to a completed or cancelled task.',
                'type' => 'error',
            ]);
        }

        $task->update([
            'assigned_to' => $request->assigned_to,
        ]);

        return back()->with([
            'message' => 'Staff assigned to maintenance task successfully.',
            'type' => 'success',
        ]);
    }

    public function exportHistory(Request $request)
    {
        $year = $request->query('year', now()->year);
        $month = $request->query('month');

        $monthName = ($month && $month !== 'all')
            ? date('F', mktime(0, 0, 0, $month, 1))
            : 'All Months';

        $data = DamageReports::with(['room', 'assign'])
            ->whereIn('status', ['completed', 'cancelled'])
            ->whereYear('reported_at', $year)
            ->when($month && $month !== 'all', fn($q) => $q->whereMonth('reported_at', $month))
            ->latest()
            ->get();

        $fileName = "Data_Maintenance_{$monthName}_{$year}.xlsx";

        return Excel::download(
            new DamageReportsExport($data, $monthName, $year),
            $fileName
        );
    }
}
