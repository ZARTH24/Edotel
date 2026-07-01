<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Users
        $this->call([
            UserSeeder::class,
            RoomsSeeder::class,
            ExerciseSeeder::class,
            StudyCaseSeeder::class,
        ]);

        // Optional: Seed test progress data for testing unlock feature
        // Uncomment the line below to run, or run separately with:
        // php artisan db:seed --class=TestProgressSeeder
        // $this->call(TestProgressSeeder::class);
    }
}
