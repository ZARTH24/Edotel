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
        Schema::create('student_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('exercise_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['locked', 'opened', 'completed'])->default('locked');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Unique constraint: one progress entry per user per exercise
            $table->unique(['user_id', 'exercise_id']);

            // Indexes
            $table->index('user_id');
            $table->index('exercise_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_progress');
    }
};
