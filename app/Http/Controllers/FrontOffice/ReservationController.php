<?php

namespace App\Http\Controllers\FrontOffice;

use App\Exports\ReservationsExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\FrontOffice\StoreReservationRequest;
use App\Models\FrontOffice\Guest;
use App\Models\FrontOffice\Reservation;
use App\Models\FrontOffice\Room;
use App\Models\HouseKeeping\CleaningTask;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class ReservationController extends Controller
{
    public function create(Request $request)
    {
        $checkIn = $request->check_in ? Carbon::parse($request->check_in) : null;
        $checkOut = $request->check_out ? Carbon::parse($request->check_out) : null;

        $query = Room::orderBy('number', 'asc')->where('status', '!=', 'maintenance');

        if ($checkIn && $checkOut) {
            $query->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut) {
                $q->whereIn('status', ['confirmed', 'checked-in'])
                    ->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            });
        }

        $availableRooms = $query->get();

        return inertia('FrontOffice/Reservation', compact('availableRooms'));
    }

    public function store(StoreReservationRequest $request)
    {
        $data = $request->validated();

        try {
            return DB::transaction(function () use ($data) {
                // 1. Guest & Room
                $guest = Guest::firstOrCreate(['id_number' => $data['id_number']], $data);
                $room = Room::findOrFail($data['room_id']);

                // Update status hanya jika available
                if ($room->status === 'available') {
                    $room->update(['status' => 'reserved']);
                }

                // 2. Durasi Inap
                $checkIn = Carbon::parse($data['check_in']);
                $checkOut = Carbon::parse($data['check_out']);
                $nights = $checkIn->diffInDays($checkOut) ?: 1;

                // 3. Kalkulasi Miscellaneous Dinamis (Price * Qty)
                $miscCollection = collect($data['miscellaneous'] ?? [])->filter(function ($item) {
                    return !empty($item['service']);
                });

                $totalMiscPrice = $miscCollection->reduce(function ($total, $item) {
                    return $total + ($item['price'] * ($item['qty'] ?? 1));
                }, 0);

                // 4. Total Akhir
                $roomTotal = $room->price * $nights;
                $grandTotal = $roomTotal + $totalMiscPrice;

                // 5. Simpan ke Database
                Reservation::create([
                    'booking_reference' => Reservation::generateBookingReference(),
                    'guest_id' => $guest->id,
                    'room_id' => $room->id,
                    'check_in' => $data['check_in'],
                    'check_out' => $data['check_out'],
                    'total_price' => $grandTotal,
                    'misc_details' => $miscCollection->values()->all(),
                    'special_requests' => $data['special_requests'],
                    'number_of_guests' => $data['number_of_guests'],
                    'status' => 'confirmed',
                    'payment_status' => 'pending',
                    'payment_method' => $data['payment_method'],
                ]);

                return redirect('/Frontoffice')->with([
                    'message' => 'Reservation successfully added!',
                    'type' => 'success'
                ]);
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return back()->with([
                'message' => 'Error: ' . $e->getMessage(),
                'type' => 'error'
            ]);
        }
    }

    public function show($booking_reference)
    {
        $reservation = Reservation::with(['guest', 'room'])->where('booking_reference', $booking_reference)->firstOrFail();
        $manager = User::where('role', 'admin')->first();

        return inertia('FrontOffice/ReservationDetail', [
            'reservation' => $reservation,
            'manager' => $manager,
        ]);
    }


    public function edit(Reservation $reservation, Request $request)
    {
        $checkIn = $request->check_in ? Carbon::parse($request->check_in) : Carbon::parse($reservation->check_in);
        $checkOut = $request->check_out ? Carbon::parse($request->check_out) : Carbon::parse($reservation->check_out);

        $query = Room::where('status', '!=', 'maintenance');

        $query->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut, $reservation) {
            $q->where('id', '!=', $reservation->id) // Abaikan reservasi ini sendiri agar kamarnya tetap muncul di list
                ->whereIn('status', ['confirmed', 'checked-in'])
                ->where('check_in', '<', $checkOut)
                ->where('check_out', '>', $checkIn);
        });

        $availableRooms = $query->get();

        $reservation->load(['guest', 'room']);

        return inertia('FrontOffice/EditReservation', [
            'reservation' => $reservation,
            'availableRooms' => $availableRooms,
        ]);
    }

    public function update(StoreReservationRequest $request, Reservation $reservation)
    {
        DB::transaction(function () use ($request, $reservation) {
            // 1. Update data tamu
            $reservation->guest->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'nationality' => $request->nationality,
                'id_type' => $request->id_type,
                'id_number' => $request->id_number,
                'address' => $request->address,
                'date_of_birth' => $request->date_of_birth,
            ]);

            // 2. Room status handling jika kamar berubah
            $oldRoomId = $reservation->getOriginal('room_id');
            $newRoomId = (int) $request->room_id;

            if ($oldRoomId !== $newRoomId) {
                $newRoom = Room::findOrFail($newRoomId);

                if ($newRoom->status === 'occupied' || $newRoom->status === 'maintenance') {
                    throw new \Exception("Room {$newRoom->number} is currently {$newRoom->status} and cannot be assigned.");
                }

                // Set new room to reserved
                $newRoom->update(['status' => 'reserved']);

                // Free old room (only if no other active reservations)
                $hasOtherActive = Reservation::where('room_id', $oldRoomId)
                    ->where('id', '!=', $reservation->id)
                    ->whereIn('status', ['confirmed', 'checked-in'])
                    ->exists();

                if (!$hasOtherActive) {
                    Room::where('id', $oldRoomId)->update(['status' => 'available']);
                }
            }

            // 3. Hitung ulang total harga
            $room = Room::findOrFail($request->room_id);

            $checkIn = Carbon::parse($request->check_in);
            $checkOut = Carbon::parse($request->check_out);
            $nights = $checkIn->diffInDays($checkOut);
            if ($nights <= 0) $nights = 1;

            $totalPrice = $room->price * $nights;

            if ($request->has('miscellaneous')) {
                foreach ($request->miscellaneous as $misc) {
                    $price = floatval($misc['price'] ?? 0);
                    $qty = intval($misc['qty'] ?? 1);
                    $totalPrice += ($price * $qty);
                }
            }

            // 4. Update data reservasi
            $reservation->update([
                'room_id' => $request->room_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'number_of_guests' => $request->number_of_guests,
                'total_price' => $totalPrice,
                'misc_details' => $request->miscellaneous,
                'payment_method' => $request->payment_method,
                'special_requests' => $request->special_requests,
            ]);
        });

        return redirect('/Frontoffice')->with([
            'message' => 'Reservation updated successfully!',
            'type' => 'success'
        ]);
    }

    public function checkin(Reservation $reservation)
    {
        // 1. Load relasi agar data room tersedia
        $reservation->load('room');
        $room = $reservation->room;

        // 2. Validasi Alur Reservasi (Mencegah check-in ganda atau reservasi batal)
        if ($reservation->status !== 'confirmed') {
            return redirect()->back()->with([
                'message' => 'Only reservations with "confirmed" status can check in.',
                'type' => 'error',
            ]);
        }

        // 3. Cek Kondisi Fisik Kamar
        if ($room->status === 'cleaning') {
            return redirect()->back()->with([
                'message' => 'Room number ' . $room->number . ' is currently being cleaned.',
                'type' => 'error',
            ]);
        }

        if ($room->status === 'maintenance') {
            return redirect()->back()->with([
                'message' => 'Room number ' . $room->number . ' is currently under maintenance.',
                'type' => 'error',
            ]);
        }

        if ($room->status === 'occupied') {
            return redirect()->back()->with([
                // 'message' => 'Kamar masih terisi oleh tamu lain.',
                'message' => 'Room ' . $room->number . ' is still occupied by another guest.',
                'type' => 'error',
            ]);
        }

        try {
            DB::transaction(function () use ($reservation, $room) {
                // Update Data Reservasi
                $reservation->update([
                    'status' => 'checked-in',
                    'checked_in_at' => now(),
                ]);

                // Update Status Kamar menjadi terisi
                $room->update([
                    'status' => 'occupied'
                ]);
            });

            return redirect()->back()->with([
                // 'message' => 'Check-in berhasil! Kamar ' . $room->number . ' kini berstatus OCCUPIED.',
                'message' => 'Check-in successful! Room ' . $room->number . ' is now marked as OCCUPIED.',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            // Log error jika terjadi kegagalan database
            Log::error("Check-in failed ID {$reservation->id}: " . $e->getMessage());

            return redirect()->back()->with([
                'message' => 'A system error occurred during check-in.',
                'type' => 'error',
            ]);
        }
    }

    public function checkout(Reservation $reservation)
    {
        try {
            DB::transaction(function () use ($reservation) {
                // 1. Validasi Awal
                if ($reservation->status !== 'checked-in') {
                    throw new \Exception('Guest has not checked in yet.');
                }

                if (!$reservation->checked_in_at) {
                    throw new \Exception('Check-in timestamp data not found.');
                }

                // 2. Set Waktu Check-out
                $reservation->checked_out_at = now();
                $checkIn = Carbon::parse($reservation->checked_in_at);
                $checkOut = Carbon::parse($reservation->checked_out_at);

                // 3. Hitung Durasi Inap (Minimal 1 Malam)
                $nights = ceil($checkIn->diffInHours($checkOut) / 24);
                $nights = max(1, $nights);

                // 4. Hitung Total Harga (Room + Services/Misc)
                $roomPrice = $reservation->room->price * $nights;

                $miscPrice = collect($reservation->misc_details)->reduce(function ($total, $item) {
                    $price = floatval($item['price'] ?? 0);
                    $qty = intval($item['qty'] ?? 1); // Mengambil qty dari array $item

                    return $total + ($price * $qty);
                }, 0);

                $reservation->total_price = $roomPrice + $miscPrice;
                $reservation->status = 'checked-out';
                $reservation->payment_status = 'paid'; // Asumsi lunas saat checkout
                $reservation->save();

                // 5. Logika Prioritas Pembersihan (Sudah Bagus!)
                $room = $reservation->room;
                $nextReservation = $room->reservations()
                    ->where('status', 'confirmed') // Hanya hitung reservasi yang valid
                    // ->where('check_in', '>=', $reservation->checked_out_at->format('Y-m-d'))
                    ->where('check_in', '>=', \Carbon\Carbon::parse($reservation->checked_out_at)->format('Y-m-d'))
                    ->orderBy('check_in', 'asc')
                    ->first();

                $priority = 'low';
                if ($nextReservation) {
                    $diffHours = $checkOut->diffInHours(Carbon::parse($nextReservation->check_in));

                    if ($diffHours <= 5) {
                        $priority = 'high'; // Tamu berikutnya datang kurang dari 5 jam
                    } elseif ($diffHours <= 24) {
                        $priority = 'medium'; // Tamu berikutnya datang besok
                    }
                }

                // 6. Buat Task Cleaning & Update Room
                // Gunakan updateOrCreate untuk mencegah double task jika tertekan 2x
                CleaningTask::create([
                    'room_id' => $room->id,
                    'status' => 'pending',
                    'priority' => $priority,
                ]);

                $room->update(['status' => 'cleaning']);

                Log::info("Checkout successful: Reservation #{$reservation->id}, Room {$room->number}");
            });

            return redirect()->back()->with([
                'message' => "Check-out successful. Room is being cleaned (Priority: " . strtoupper($priority ?? 'low') . ").",
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error("Checkout failed ID {$reservation->id}: " . $e->getMessage());

            return redirect()->back()->with([
                'message' => $e->getMessage(),
                'type' => 'error',
            ]);
        }
    }

    public function cancel(Reservation $reservation)
    {
        try {
            // 1. Validation: Prevent cancellation if guest has already checked in or checked out
            if (in_array($reservation->status, ['checked-in', 'checked-out'])) {
                return redirect()->back()->with([
                    'message' => 'Cannot cancel: Guest has already checked in or the stay is completed.',
                    'type' => 'error',
                ]);
            }

            DB::transaction(function () use ($reservation) {
                // 2. Update Reservation Status
                $reservation->update([
                    'status' => 'cancelled',
                ]);

                // 3. Update Room Status
                // Only revert to 'available' if the room is currently 'reserved'
                $room = $reservation->room;
                if ($room->status === 'reserved') {
                    $room->update([
                        'status' => 'available'
                    ]);
                }

                Log::info("Reservation #{$reservation->id} has been cancelled.");
            });

            return redirect()->back()->with([
                'message' => 'Reservation has been successfully cancelled and room status updated.',
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error("Failed to cancel reservation #{$reservation->id}: " . $e->getMessage());

            return redirect()->back()->with([
                'message' => 'An error occurred while trying to cancel the reservation.',
                'type' => 'error',
            ]);
        }
    }

    public function exportHistory(Request $request)
    {
        $year = $request->query('year', now()->year);
        $month = $request->query('month');

        // 1. Dapatkan nama bulan
        $monthName = ($month && $month !== 'all')
            ? date('F', mktime(0, 0, 0, $month, 1))
            : 'All Months';

        // 2. Ambil data
        $data = Reservation::with(['guest', 'room'])
            ->whereIn('status', ['checked-out', 'cancelled'])
            ->whereYear('check_in', $year)
            ->when($month && $month !== 'all', fn($q) => $q->whereMonth('check_in', $month))
            ->latest()
            ->get();

        $fileName = "Data_Reservation_{$monthName}_{$year}.xlsx";

        // 3. KIRIM 3 ARGUMEN SESUAI DENGAN CONSTRUCTOR
        return Excel::download(
            new ReservationsExport($data, $monthName, $year),
            $fileName
        );
    }
}
