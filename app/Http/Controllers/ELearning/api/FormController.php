<?php

namespace App\Http\Controllers\ELearning\api;

use App\Http\Controllers\Controller;
use App\Services\ELearning\ExerciseFormService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormController extends Controller
{
    /**
     * Get form configuration for an exercise.
     */
    public function getConfig(string $slug)
    {
        $config = ExerciseFormService::getConfig($slug);

        if (!$config) {
            return response()->json([
                'error' => 'Exercise not found',
            ], 404);
        }

        return response()->json([
            'fields' => $config['fields'] ?? [],
            'clues' => $config['clues'] ?? [],
        ]);
    }
}
