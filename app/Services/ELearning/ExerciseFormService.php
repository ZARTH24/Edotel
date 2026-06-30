<?php

namespace App\Services\ELearning;

/**
 * E-Learning Exercise Form Service
 *
 * Handles form configuration and validation for E-Learning exercises.
 */
class ExerciseFormService
{
    /**
     * Get form configuration for an exercise by slug.
     */
    public static function getConfig(string $slug): ?array
    {
        $configs = self::getAllConfigs();
        return $configs[$slug] ?? null;
    }

    /**
     * Get correct answers for an exercise.
     */
    public static function getAnswers(string $slug): array
    {
        $config = self::getConfig($slug);
        return $config['answers'] ?? [];
    }

    /**
     * Get clues for an exercise.
     */
    public static function getClues(string $slug): array
    {
        $config = self::getConfig($slug);
        return $config['clues'] ?? [];
    }

    /**
     * Get form fields for an exercise.
     */
    public static function getFields(string $slug): array
    {
        $config = self::getConfig($slug);
        return $config['fields'] ?? [];
    }

    /**
     * Validate answers for an exercise.
     */
    public static function validateAnswers(string $slug, array $userAnswers): array
    {
        $correctAnswers = self::getAnswers($slug);
        $clues = self::getClues($slug);

        $wrongFields = [];
        $allCorrect = true;

        foreach ($correctAnswers as $field => $correctValue) {
            $userValue = $userAnswers[$field] ?? '';

            // Normalize for comparison
            $normalizedUser = self::normalize($userValue);
            $normalizedCorrect = self::normalize($correctValue);

            if ($normalizedUser !== $normalizedCorrect) {
                $allCorrect = false;
                $wrongFields[$field] = [
                    'correct' => $correctValue,
                    'user' => $userValue,
                    'clue' => $clues[$field] ?? 'Periksa kembali informasi pada studi kasus.',
                ];
            }
        }

        return [
            'is_correct' => $allCorrect,
            'score' => $allCorrect ? 100 : 0,
            'wrong_fields' => array_keys($wrongFields),
            'wrong_details' => $wrongFields,
            'clues' => $clues,
        ];
    }

    /**
     * Normalize value for comparison.
     * - Trim whitespace
     * - Convert to lowercase
     * - Normalize date format
     */
    public static function normalize($value): string
    {
        if (is_array($value)) {
            $value = implode(',', $value);
        }

        $value = trim($value);
        $value = strtolower($value);

        // Normalize date format (YYYY-MM-DD to DD/MM/YYYY)
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            $parts = explode('-', $value);
            $value = $parts[2] . '/' . $parts[1] . '/' . $parts[0];
        }

        return $value;
    }

    /**
     * Get all configurations.
     */
    public static function getAllConfigs(): array
    {
        return array_merge(
            ReceptionFormConfig::getConfig(),
            ReceptionFormConfig2::getConfig(),
            ReservationFormConfig::getConfig(),
            ReservationFormConfig2::getConfig()
        );
    }
}
