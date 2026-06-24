<?php

namespace App\Http\Requests\HouseKeeping;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CleaningTaskRequest extends FormRequest
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
            'room_id' => 'required|exists:rooms,id',
            // 'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'required|in:low,medium,high',
            'notes' => 'nullable|string',
        ];
    }
}
