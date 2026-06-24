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
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 50);
            $table->string('nationality', 100)->nullable();
            $table->string('id_number')->unique();
            $table->enum('id_type', ['passport', 'national_id', 'driver_license'])->default('passport');
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('phone');
            $table->index('id_number');
            $table->index('nationality');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
