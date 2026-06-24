<?php

namespace App\Http\Requests\FrontOffice;


use Illuminate\Foundation\Http\FormRequest;

class GuestRequest extends FormRequest
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
            'name' => 'required|string|min:3|max:255',
            'email' => 'nullable|email',
            'phone' => 'required|numeric|digits_between:10,13',
            'nationality' => 'nullable|string|max:100',
            'id_type' => 'required|in:passport,national_id,driver_license',
            'id_number' => 'required|string|max:100',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date',
        ];
    }

    public function messages(): array
    {
        return [
            // Guest Personal Information
            'name.required' => 'The guest name is required.',
            'name.min' => 'The guest name must be at least 3 characters long.',
            'email.email' => 'Please enter a valid email address.',
            'phone.required' => 'A contact number is required.',
            'phone.numeric' => 'the phone number you entered is invalid',
            'phone.digits_between' => 'The phone number must be between 10 and 13 digits.',

            // Identity Information
            'id_type.required' => 'Please select the type of identification provided.',
            'id_type.in' => 'The selected identification type is invalid.',
            'id_number.required' => 'The identification number is required.',
            'date_of_birth.date' => 'Please provide a valid date of birth.',
        ];
    }
}
