<?php

namespace Database\Seeders;

use App\Models\ELearning\Exercise;
use App\Models\ELearning\StudentAnswer;
use App\Models\ELearning\StudentProgress;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TestProgressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Creates 2 test students:
     * 1. Siswa Selesai (100% complete) - menus should be UNLOCKED
     * 2. Siswa Hampir Selesai (93% complete) - 1 exercise remaining
     */
    public function run(): void
    {
        // =====================================================
        // Get all exercises
        // =====================================================
        $receptionExercises = Exercise::reception()->orderBy('order_number')->get();
        $reservationExercises = Exercise::reservation()->orderBy('order_number')->get();
        $allExercises = $receptionExercises->merge($reservationExercises);

        $this->command->info('Total exercises: ' . $allExercises->count());
        $this->command->info('Reception: ' . $receptionExercises->count());
        $this->command->info('Reservation: ' . $reservationExercises->count());

        // =====================================================
        // STUDENT 1: Siswa Selesai (100% - ALL COMPLETED)
        // =====================================================
        $student1 = DB::table('users')->where('email', 'selesai@test.siswa.id')->first();

        if (!$student1) {
            $student1Id = DB::table('users')->insertGetId([
                'name' => 'Siswa Selesai',
                'email' => 'selesai@test.siswa.id',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'avatar' => null,
                'phone' => '081234567890',
                'nisn' => '9999999991',
                'kelas' => 'XII AHU TEST',
                'is_active' => true,
                'is_menu_unlocked' => true, // ALREADY UNLOCKED
                'unlocked_at' => Carbon::now()->subDays(1),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info('Created student 1: Siswa Selesai (ID: ' . $student1Id . ')');
        } else {
            $student1Id = $student1->id;
            // Update to unlocked
            DB::table('users')->where('id', $student1Id)->update([
                'is_menu_unlocked' => true,
                'unlocked_at' => Carbon::now()->subDays(1),
            ]);
            $this->command->info('Updated student 1: Siswa Selesai (ID: ' . $student1Id . ')');
        }

        // Seed ALL 15 exercises as completed for Student 1
        foreach ($allExercises as $index => $exercise) {
            $this->seedExerciseProgress($student1Id, $exercise, $index + 1, true);
        }

        $this->command->info('Student 1 (Siswa Selesai) - All 15 exercises completed: UNLOCKED');

        // =====================================================
        // STUDENT 2: Siswa Hampir Selesai (14/15 = 93%)
        // =====================================================
        $student2 = DB::table('users')->where('email', 'hampir@test.siswa.id')->first();

        if (!$student2) {
            $student2Id = DB::table('users')->insertGetId([
                'name' => 'Siswa Hampir Selesai',
                'email' => 'hampir@test.siswa.id',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'avatar' => null,
                'phone' => '081234567891',
                'nisn' => '9999999992',
                'kelas' => 'XII AHU TEST',
                'is_active' => true,
                'is_menu_unlocked' => false, // STILL LOCKED
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info('Created student 2: Siswa Hampir Selesai (ID: ' . $student2Id . ')');
        } else {
            $student2Id = $student2->id;
            // Make sure it's locked
            DB::table('users')->where('id', $student2Id)->update([
                'is_menu_unlocked' => false,
                'unlocked_at' => null,
            ]);
            $this->command->info('Updated student 2: Siswa Hampir Selesai (ID: ' . $student2Id . ')');
        }

        // Seed Reception (9 exercises) - ALL COMPLETED
        foreach ($receptionExercises as $index => $exercise) {
            $this->seedExerciseProgress($student2Id, $exercise, $index + 1, true);
        }

        // Seed Reservation (6 exercises) - 5 COMPLETED, 1 REMAINING
        foreach ($reservationExercises as $index => $exercise) {
            if ($index < 5) {
                // First 5 Reservation exercises - COMPLETED
                $this->seedExerciseProgress($student2Id, $exercise, $index + 1, true);
            } else {
                // Last Reservation exercise (Reservation Confirmation) - ONLY OPENED, NOT COMPLETED
                $this->seedExerciseProgress($student2Id, $exercise, $index + 1, false);
            }
        }

        $this->command->info('Student 2 (Siswa Hampir Selesai) - 14/15 exercises completed: LOCKED');
        $this->command->info('Remaining exercise: Reservation Confirmation');

        $this->command->info('');
        $this->command->info('=== TEST CREDENTIALS ===');
        $this->command->info('Student 100% (UNLOCKED): selesai@test.siswa.id / password');
        $this->command->info('Student 93% (LOCKED):  hampir@test.siswa.id / password');
        $this->command->info('Admin (Guru):         guru@example.com / password');
    }

    /**
     * Seed progress and answer for a single exercise
     */
    private function seedExerciseProgress(int $userId, $exercise, int $attempt, bool $completed): void
    {
        // Check if progress exists
        $existingProgress = DB::table('student_progress')
            ->where('user_id', $userId)
            ->where('exercise_id', $exercise->id)
            ->first();

        if (!$existingProgress) {
            // Create progress
            DB::table('student_progress')->insert([
                'user_id' => $userId,
                'exercise_id' => $exercise->id,
                'status' => $completed ? 'completed' : 'opened',
                'completed_at' => $completed ? Carbon::now()->subDays(rand(1, 7)) : null,
                'created_at' => Carbon::now()->subDays(rand(8, 14)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        } else {
            // Update existing progress
            DB::table('student_progress')
                ->where('user_id', $userId)
                ->where('exercise_id', $exercise->id)
                ->update([
                    'status' => $completed ? 'completed' : 'opened',
                    'completed_at' => $completed ? Carbon::now()->subDays(rand(1, 7)) : null,
                    'updated_at' => Carbon::now(),
                ]);
        }

        // Check if answer exists
        $existingAnswer = DB::table('student_answers')
            ->where('user_id', $userId)
            ->where('exercise_id', $exercise->id)
            ->first();

        if (!$existingAnswer) {
            // Create answer (simulated correct answer data)
            DB::table('student_answers')->insert([
                'user_id' => $userId,
                'exercise_id' => $exercise->id,
                'answers' => json_encode([
                    'simulated' => true,
                    'test_data' => true,
                    'exercise' => $exercise->slug,
                ]),
                'score' => $completed ? 100 : 0,
                'is_completed' => $completed,
                'attempt' => $attempt,
                'created_at' => Carbon::now()->subDays(rand(1, 7)),
                'updated_at' => Carbon::now()->subDays(rand(1, 7)),
            ]);
        }
    }
}
