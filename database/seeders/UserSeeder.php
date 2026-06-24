<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // 1 Admin
        DB::table('users')->insert([
            'name' => $faker->name,
            'email' => 'admin@example.com',
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'avatar' => null,
            'phone' => $faker->phoneNumber,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Role-role lain
        $roles = ['front-office', 'housekeeping'];

        foreach ($roles as $role) {
            for ($i = 1; $i <= 3; $i++) { // buat 3 akun per role
                DB::table('users')->insert([
                    'name' => $faker->name,
                    'email' => $faker->unique()->safeEmail,
                    'email_verified_at' => $role === 'front-office' ? Carbon::now() : null,
                    'password' => Hash::make('password'),
                    'role' => $role,
                    'avatar' => null,
                    'phone' => $faker->phoneNumber,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
