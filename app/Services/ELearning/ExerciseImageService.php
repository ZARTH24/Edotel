<?php

namespace App\Services\ELearning;

/**
 * Image path mapping for E-Learning forms.
 */
class ExerciseImageService
{
    /**
     * Get image paths for an exercise.
     */
    public static function getImagePaths(string $slug): array
    {
        $paths = self::getAllMappings();
        return $paths[$slug] ?? [];
    }

    /**
     * Get primary image path (first page).
     */
    public static function getPrimaryImage(string $slug): ?string
    {
        $paths = self::getImagePaths($slug);
        return $paths[0] ?? null;
    }

    /**
     * Get all slug to image mappings.
     * Keys are exercise slugs, values are arrays of image paths.
     */
    private static function getAllMappings(): array
    {
        return [
            // =====================================================
            // RECEPTION EXERCISES
            // =====================================================

            'registration-form' => [
                '/assets/forms/reservation/Registration Form (1).png',
            ],

            'guest-card' => [
                '/assets/forms/reservation/GUEST CARD (2).png',
            ],

            'breakfast-coupon' => [
                '/assets/forms/reservation/BREAKFAST COUPON (3).png',
            ],

            'guest-in-house' => [
                '/assets/forms/reservation/GUEST IN HOUSE FORM (5).png',
            ],

            'arrival-book' => [
                '/assets/forms/reservation/Arrival Book (6)_PNG/Arrival Book (6)_page_1.png',
                '/assets/forms/reservation/Arrival Book (6)_PNG/Arrival Book (6)_page_2.png',
            ],

            'cash-receipt' => [
                '/assets/forms/reservation/Cash Receipt (4)_PNG/Cash Receipt (4)_page_1.png',
                '/assets/forms/reservation/Cash Receipt (4)_PNG/Cash Receipt (4)_page_2.png',
                '/assets/forms/reservation/Cash Receipt (4)_PNG/Cash Receipt (4)_page_3.png',
                '/assets/forms/reservation/Cash Receipt (4)_PNG/Cash Receipt (4)_page_4.png',
            ],

            'departure-book' => [
                '/assets/forms/reservation/Departure Book (7)_PNG/Departure Book (7)_page_1.png',
                '/assets/forms/reservation/Departure Book (7)_PNG/Departure Book (7)_page_2.png',
            ],

            'expected-departure' => [
                '/assets/forms/reservation/Expected Departure Liest (8)_PNG/Expected Departure Liest (8)_page_1.png',
                '/assets/forms/reservation/Expected Departure Liest (8)_PNG/Expected Departure Liest (8)_page_2.png',
            ],

            'guest-bill' => [
                '/assets/forms/reservation/Guest  Bill (9)_PNG/Guest  Bill (9)_page_1.png',
                '/assets/forms/reservation/Guest  Bill (9)_PNG/Guest  Bill (9)_page_2.png',
            ],

            // =====================================================
            // RESERVATION EXERCISES
            // =====================================================

            'reservation-form' => [
                '/assets/forms/reception/Reservation form (1)_PNG/Reservation form (1)_page_1.png',
            ],

            'reservation-slip' => [
                '/assets/forms/reception/Reservation Slip (2)_PNG/Reservation Slip (2)_page_1.png',
                '/assets/forms/reception/Reservation Slip (2)_PNG/Reservation Slip (2)_page_2.png',
            ],

            'expected-arrival' => [
                '/assets/forms/reception/Expected Arrival Liest (3)_PNG/Expected Arrival Liest (3)_page_1.png',
            ],

            'reservation-diary' => [
                '/assets/forms/reception/Reservation Diary (4)_PNG/Reservation Diary (4)_page_1.png',
                '/assets/forms/reception/Reservation Diary (4)_PNG/Reservation Diary (4)_page_2.png',
            ],

            'conventional-chart' => [
                '/assets/forms/reception/Conventional Chart (5)_PNG/Conventional Chart (5)_page_1.png',
            ],

            'reservation-confirmation' => [
                '/assets/forms/reception/Reservation Confirmation (6)_PNG/Reservation Confirmation (6)_page_1.png',
            ],
        ];
    }
}
