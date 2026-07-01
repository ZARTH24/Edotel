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

        // =====================================================
        // ADMIN (Guru) - 1 user
        // =====================================================
        DB::table('users')->insert([
            'name' => 'Guru Edotel',
            'email' => 'guru@example.com',
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'avatar' => null,
            'phone' => $faker->phoneNumber,
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Admin kedua (opsional)
        DB::table('users')->insert([
            'name' => 'Admin Hotel',
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

        // =====================================================
        // SISWA - 10 users
        // =====================================================
        $siswaData = [
            ['name' => 'Ahmad Fauzi', 'nisn' => '1234567890', 'kelas' => 'XII AHU 1'],
            ['name' => 'Siti Nurhaliza', 'nisn' => '1234567891', 'kelas' => 'XII AHU 1'],
            ['name' => 'Budi Santoso', 'nisn' => '1234567892', 'kelas' => 'XII AHU 1'],
            ['name' => 'Dewi Lestari', 'nisn' => '1234567893', 'kelas' => 'XII AHU 2'],
            ['name' => 'Rizky Ramadhan', 'nisn' => '1234567894', 'kelas' => 'XII AHU 2'],
            ['name' => 'Putri Ayu', 'nisn' => '1234567895', 'kelas' => 'XII AHU 2'],
            ['name' => 'Dimas Prasetyo', 'nisn' => '1234567896', 'kelas' => 'XII AHU 3'],
            ['name' => 'Nurul Hidayah', 'nisn' => '1234567897', 'kelas' => 'XII AHU 3'],
            ['name' => 'Galang Akbar', 'nisn' => '1234567898', 'kelas' => 'XII AHU 3'],
            ['name' => 'Rina Wulandari', 'nisn' => '1234567899', 'kelas' => 'XII AHU 3'],
        ];

        foreach ($siswaData as $index => $siswa) {
            DB::table('users')->insert([
                'name' => $siswa['name'],
                'email' => strtolower(str_replace(' ', '.', $siswa['name'])) . '@siswa.sch.id',
                'email_verified_at' => Carbon::now(),
                'password' => Hash::make('password'),
                'role' => 'siswa',
                'avatar' => null,
                'phone' => $faker->phoneNumber,
                'nisn' => $siswa['nisn'],
                'kelas' => $siswa['kelas'],
                'is_active' => true,
                'is_menu_unlocked' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Seeded 2 admin dan 10 siswa.');
    }
}
