<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // =====================================================
        // RECEPTION EXERCISES (9 forms)
        // =====================================================

        $receptionExercises = [
            [
                'category' => 'reception',
                'title' => 'Registration Form',
                'slug' => 'registration-form',
                'document_path' => 'doc/Reception/Registration Form (1).doc',
                'order_number' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Guest Card',
                'slug' => 'guest-card',
                'document_path' => 'doc/Reception/GUEST CARD (2).doc',
                'order_number' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Breakfast Coupon',
                'slug' => 'breakfast-coupon',
                'document_path' => 'doc/Reception/BREAKFAST COUPON (3).doc',
                'order_number' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Guest In House Form',
                'slug' => 'guest-in-house',
                'document_path' => 'doc/Reception/GUEST IN HOUSE FORM (5).doc',
                'order_number' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Arrival Book',
                'slug' => 'arrival-book',
                'document_path' => 'doc/Reception/Arrival Book (6).xls',
                'order_number' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Cash Receipt',
                'slug' => 'cash-receipt',
                'document_path' => 'doc/Reception/Cash Receipt (4).xls',
                'order_number' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Departure Book',
                'slug' => 'departure-book',
                'document_path' => 'doc/Reception/Departure Book (7).xls',
                'order_number' => 7,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Expected Departure List',
                'slug' => 'expected-departure',
                'document_path' => 'doc/Reception/Expected Departure Liest (8).xls',
                'order_number' => 8,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reception',
                'title' => 'Guest Bill',
                'slug' => 'guest-bill',
                'document_path' => 'doc/Reception/Guest  Bill (9).xls',
                'order_number' => 9,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // =====================================================
        // RESERVATION EXERCISES (6 forms)
        // =====================================================

        $reservationExercises = [
            [
                'category' => 'reservation',
                'title' => 'Reservation Form',
                'slug' => 'reservation-form',
                'document_path' => 'doc/Reservasi/Reservation form (1).doc',
                'order_number' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reservation',
                'title' => 'Reservation Slip',
                'slug' => 'reservation-slip',
                'document_path' => 'doc/Reservasi/Reservation Slip (2).xls',
                'order_number' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reservation',
                'title' => 'Expected Arrival List',
                'slug' => 'expected-arrival',
                'document_path' => 'doc/Reservasi/Expected Arrival Liest (3).doc',
                'order_number' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reservation',
                'title' => 'Reservation Diary',
                'slug' => 'reservation-diary',
                'document_path' => 'doc/Reservasi/Reservation Diary (4).xls',
                'order_number' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reservation',
                'title' => 'Conventional Chart',
                'slug' => 'conventional-chart',
                'document_path' => 'doc/Reservasi/Conventional Chart (5).doc',
                'order_number' => 5,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'category' => 'reservation',
                'title' => 'Reservation Confirmation',
                'slug' => 'reservation-confirmation',
                'document_path' => 'doc/Reservasi/Reservation Confirmation (6).docx',
                'order_number' => 6,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Combine all exercises
        $allExercises = array_merge($receptionExercises, $reservationExercises);

        // Insert exercises
        foreach ($allExercises as $exercise) {
            DB::table('exercises')->insert($exercise);
        }

        $this->command->info('Seeded ' . count($allExercises) . ' exercises.');
    }
}
