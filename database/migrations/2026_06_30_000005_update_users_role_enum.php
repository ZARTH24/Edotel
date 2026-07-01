<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Change role from enum to string to allow modification
            $table->string('role', 50)->default('siswa')->change();
        });

        // Update existing users to new roles
        \Illuminate\Support\Facades\DB::table('users')
            ->where('role', 'front-office')
            ->update(['role' => 'siswa']);

        \Illuminate\Support\Facades\DB::table('users')
            ->where('role', 'housekeeping')
            ->update(['role' => 'siswa']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'front-office', 'housekeeping'])->default('front-office')->change();
        });
    }
};
