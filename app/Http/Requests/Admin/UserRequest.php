<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

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
        $userId = $this->route('id') ?? $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],

            // 2. Modifikasi Email: Jika ada userId (proses update), kecualikan ID tersebut dari pengecekan unique
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $userId ? 'unique:users,email,' . $userId : 'unique:users,email'
            ],

            // 3. Modifikasi Password: Jika proses update, password boleh kosong (nullable)
            'password' => [
                $userId ? 'nullable' : 'required',
                'string',
                Password::defaults()
            ],

            'role' => ['required', 'in:admin,front-office,housekeeping'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_active' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Full name is required.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email is already registered in the Edotel system.',
            'password.required' => 'Account password is required.',
            'role.required' => 'Please select a staff position/role.',
            'role.in' => 'The selected role is invalid.',
        ];
    }
}
