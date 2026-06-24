<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
        $userId = $this->user ? $this->user->id : null;
        return [
            'name' => 'required|string|min:3|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'password' => $userId ? 'nullable|string|min:6|confirmed' : 'required|string|min:6|confirmed',
            'role' => ['required', Rule::in(['admin', 'front-office', 'housekeeping'])],
            'avatar' => 'nullable|string|max:500',
            'phone' => 'nullable|numeric|digits_between:10,13',
            'is_active' => 'boolean',
        ];
    }
}
