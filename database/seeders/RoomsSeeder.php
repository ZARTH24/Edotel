<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            // Super Deluxe
            ['number' => 101, 'type' => 'super deluxe', 'floor' => 1, 'price' => 350000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water', 'Coffee & tea']],
            ['number' => 102, 'type' => 'super deluxe', 'floor' => 1, 'price' => 350000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water', 'Coffee & tea']],
            // ['number' => 103, 'type' => 'super deluxe', 'floor' => 1, 'price' => 350000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water', 'Coffee & tea']],

            // Deluxe
            ['number' => 104, 'type' => 'deluxe', 'floor' => 1, 'price' => 250000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 105, 'type' => 'deluxe', 'floor' => 1, 'price' => 250000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 106, 'type' => 'deluxe', 'floor' => 1, 'price' => 250000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 108, 'type' => 'deluxe', 'floor' => 1, 'price' => 250000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 110, 'type' => 'deluxe', 'floor' => 1, 'price' => 250000, 'features' => ['AC', 'Double bed', 'Refrigirator', 'Water Heater', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],

            // Superior
            ['number' => 107, 'type' => 'superior', 'floor' => 1, 'price' => 200000, 'features' => ['Twin Bed', 'AC', 'Refrigirator', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 109, 'type' => 'superior', 'floor' => 1, 'price' => 200000, 'features' => ['Twin Bed', 'AC', 'Refrigirator', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],

            // Standard Fan
            ['number' => 103, 'type' => 'standard fan', 'floor' => 1, 'price' => 150000, 'features' => ['Double bed', 'Fan', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 111, 'type' => 'standard fan', 'floor' => 1, 'price' => 150000, 'features' => ['Double bed', 'Fan', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 112, 'type' => 'standard fan', 'floor' => 1, 'price' => 150000, 'features' => ['Double bed', 'Fan', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
            ['number' => 113, 'type' => 'standard fan', 'floor' => 1, 'price' => 150000, 'features' => ['Double bed', 'Fan', 'Wifi', 'Breakfast', 'Toiletries', 'Mineral water']],
        ];

        foreach ($rooms as $room) {
            DB::table('rooms')->insert([
                'number'     => $room['number'],
                'type'       => $room['type'],
                'status'     => 'available', // Default value
                'floor'      => $room['floor'],
                'price'      => $room['price'],
                'features'   => json_encode($room['features']), // Konversi array ke JSON
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
