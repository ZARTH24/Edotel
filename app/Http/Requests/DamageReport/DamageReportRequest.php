<?php

namespace App\Http\Requests\DamageReport;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DamageReportRequest extends FormRequest
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
            'lokasi' => 'required|in:room,public area',
            'room_id' => 'required_if:lokasi,room|nullable|exists:rooms,id',
            'ruangan' => 'required_if:lokasi,public area|nullable|string|max:200',
            'issue' => 'required|string',
            'priority' => 'required|in:low,medium,high',
            'reported_by' => 'nullable|string|max:255',
            'estimated_cost' => 'nullable|numeric',
        ];
    }
}
