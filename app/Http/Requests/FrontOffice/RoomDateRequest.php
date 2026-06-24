<?php

namespace App\Http\Requests\FrontOffice;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RoomDateRequest extends FormRequest
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
        // Cek apakah kita sedang dalam mode edit/update
        // $isUpdate = $this->isMethod('put') || $this->isMethod('patch');
        $isEdit = $this->route('id') || $this->has('is_edit');
        return [
            // Jika update, hilangkan 'after_or_equal:today' agar tanggal lama tetap sah
            'check_in' => [
                'required',
                'date',
                $isEdit ? null : 'after_or_equal:today'
            ],
            'check_out' => 'required|date|after:check_in',
            'special_requests' => 'nullable|string',
            'number_of_guests' => 'required|integer|min:1',
            'miscellaneous' => 'required|array',
            'miscellaneous.*.service' => 'required|string|max:255',
            'miscellaneous.*.price' => 'required|numeric|min:0',
            'miscellaneous.*.qty' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            // Date & Guest Rules
            'check_in.required' => 'Please select a check-in date.',
            'check_in.after_or_equal' => 'The check-in date cannot be in the past.',
            'check_out.required' => 'Please select a check-out date.',
            'check_out.after' => 'The check-out date must be at least one day after the check-in date.',
            'number_of_guests.required' => 'Please specify the number of guests.',
            'number_of_guests.min' => 'There must be at least one guest for the reservation.',

            // Miscellaneous/Additional Services Rules
            'miscellaneous.array' => 'The additional services format is invalid.',
            'miscellaneous.*.service.required' => 'Please select or enter the name of the service.',
            'miscellaneous.*.service.max' => 'The service name is too long.',
            'miscellaneous.*.price.required' => 'Please provide a price for the selected service.',
            'miscellaneous.*.price.numeric' => 'The service price must be a valid number.',
            'miscellaneous.*.price.min' => 'The service price cannot be negative.',
            'miscellaneous.*.qty.required' => 'Please specify the quantity for this service.',
            'miscellaneous.*.qty.integer' => 'Quantity must be a whole number.',
            'miscellaneous.*.qty.min' => 'The minimum quantity for a service is 1.',
        ];
    }
}
