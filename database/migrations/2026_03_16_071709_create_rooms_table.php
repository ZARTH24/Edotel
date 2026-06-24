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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->integer('number')->unique();
            $table->enum('type', ['deluxe', 'super deluxe', 'superior', 'standard fan']);
            $table->enum('status', ['available', 'occupied', 'cleaning', 'maintenance', 'reserved'])->default('available');
            $table->integer('floor');
            $table->decimal('price', 10, 2);
            $table->json('features');
            $table->softDeletes();
            $table->timestamps();

            $table->index('number');
            $table->index('type');
            $table->index('status');
            $table->index('floor');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
