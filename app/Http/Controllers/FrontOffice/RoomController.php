<?php

namespace App\Http\Controllers\FrontOffice;

use App\Http\Controllers\Controller;
use App\Http\Requests\FrontOffice\RoomRequest;
use App\Models\FrontOffice\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoomController extends Controller
{
    public function create()
    {
        return inertia('FrontOffice/Room/Create');
    }

    public function store(RoomRequest $request)
    {
        $data = $request->validated();
        Room::create($data);

        return to_route("Frontoffice")->with(['message' => "New room successfully added.", "type" => "success"]);
    }

    public function edit(string $id)
    {
        // Pastikan model Room di-import di bagian atas
        $room = Room::findOrFail($id);

        return inertia('FrontOffice/Room/Edit', [
            'room' => $room // Mengirim data ke React sebagai props
        ]);
    }

    public function update(Request $request, $id)
    {
        // 1. Find the room data by ID
        $room = Room::findOrFail($id);

        // 2. Business Logic Check: Only allow update if the room status is currently 'available'
        if ($room->status !== 'available') {
            return back()->with([
                'message' => "Cannot update Room {$room->number}. Updates are only allowed when the room status is 'available'.",
                'type'    => 'error'
            ]);
        }

        // 3. Validation Rules with English Error Messages
        $validated = $request->validate([
            'number'      => ['required', 'integer', 'unique:rooms,number,' . $room->id],
            'type'        => ['required', 'in:deluxe,super deluxe,superior,standard fan'],
            'floor'       => ['required', 'integer', 'min:1'],
            'price'       => ['required', 'numeric', 'min:0'],
            'features'    => ['required', 'array'],
            'features.*'  => ['required', 'string'],
        ], [
            'number.required' => 'The room number field is mandatory.',
            'number.integer'  => 'The room number must be a valid number.',
            'number.unique'   => 'This room number is already registered in the system.',
            'type.required'   => 'Please select a valid room type.',
            'type.in'         => 'The selected room type is invalid.',
            'floor.required'  => 'The floor assignment field is mandatory.',
            'floor.integer'   => 'The floor must be a valid number.',
            'floor.min'       => 'The floor must be at least 1.',
            'price.required'  => 'The price per night field is mandatory.',
            'price.numeric'   => 'The room price must be a valid numeric value.',
            'price.min'       => 'The room price must be at least 0.',
            'features.required' => 'You must provide at least one room feature.',
            'features.*.required' => 'The feature item details cannot be left blank.',
        ]);

        // 4. Execute database record update
        $room->update($validated);

        // 5. Return back with a success message
        return to_route('Frontoffice')->with([
            'message' => "Room {$room->number} configuration has been successfully updated.",
            'type'    => 'success'
        ]);
    }

    public function availableRooms(Request $request)
    {
        $checkIn = $request->check_in ? Carbon::parse($request->check_in) : null;
        $checkOut = $request->check_out ? Carbon::parse($request->check_out) : null;

        $query = Room::where('status', '!=', 'maintenance');

        if ($checkIn && $checkOut) {
            $query->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut) {
                $q->whereIn('status', ['confirmed', 'checked-in'])
                    ->where('check_in', '<', $checkOut)
                    ->where('check_out', '>', $checkIn);
            });
        }

        $availableRooms = $query->get();

        // Tambahkan price_rupiah untuk frontend
        $availableRooms->transform(function ($room) {
            $room->price_rupiah = 'Rp ' . number_format($room->price, 0, ',', '.');
            return $room;
        });

        return response()->json($availableRooms);
    }

    public function destroy($id)
    {
        $room = Room::with(['reservations'])->findOrFail($id);

        $activeReservations = $room->reservations->whereIn('status', ['confirmed', 'checked-in']);

        if ($activeReservations->isNotEmpty()) {
            return back()->with([
                'message' => "Cannot archive Room {$room->number}. It has active reservations (confirmed/checked-in).",
                'type' => 'error',
            ]);
        }

        try {
            $room->delete();

            return to_route('Frontoffice')->with([
                'message' => "Room {$room->number} has been archived.",
                'type' => 'success',
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to archive room #{$room->id}: " . $e->getMessage());

            return back()->with([
                'message' => 'An error occurred while archiving the room.',
                'type' => 'error',
            ]);
        }
    }

    public function restore($id)
    {
        $room = Room::onlyTrashed()->findOrFail($id);
        $room->restore();

        return to_route('Frontoffice')->with([
            'message' => "Room {$room->number} has been restored.",
            'type' => 'success',
        ]);
    }
}
