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
        Schema::create('exercises', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['reception', 'reservation']);
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('document_path', 500);
            $table->integer('order_number');
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('order_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercises');
    }
};
