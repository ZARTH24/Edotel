<?php

namespace App\Http\Requests\FrontOffice;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RoomRequest extends FormRequest
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
            'number'   => 'required|numeric|digits_between:1,3|unique:rooms,number,' . $this->room,
            'type'     => 'required|in:deluxe,super deluxe,superior,standard fan',
            'status'   => 'required|in:available,occupied,cleaning,maintenance,reserved',
            'floor'    => 'required|integer|min:1',
            'price'    => 'required|numeric|min:0',
            'features' => 'nullable|array',
            'features.*' => 'string', // setiap item di array features harus string
        ];
    }
}
