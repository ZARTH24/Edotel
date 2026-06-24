<?php

namespace App\Http\Requests\FrontOffice;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Guest
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'required|string|max:50',
            'nationality' => 'nullable|string|max:100',
            'id_type' => 'required|in:passport,national_id,driver_license',
            'id_number' => 'required|string|max:100',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',

            // Reservation
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'number_of_guests' => 'required|integer|min:1',
            'special_requests' => 'nullable|string',
            'payment_method' => 'required|in:cash,transfer,credit_card',

            // --- TAMBAHAN BARU ---
            'miscellaneous' => 'nullable|array',
            'miscellaneous.*.service' => 'nullable|string',
            'miscellaneous.*.price' => 'nullable|numeric|min:0',
            'miscellaneous.*.qty' => 'required_with:miscellaneous|integer|min:1',
        ];
    }
}
