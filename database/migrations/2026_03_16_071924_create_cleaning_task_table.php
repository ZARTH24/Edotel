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
        Schema::create('cleaning_task', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->nullable()->constrained('rooms')->onDelete('set null');

            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('restrict');
            $table->enum('status', ['pending', 'in-progress', 'completed', 'inspected'])->default('pending');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->text('notes')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->foreignId('inspected_by')->nullable()->constrained('users');
            $table->timestamp('inspected_at')->nullable();
            $table->timestamps();
            $table->index('room_id');
            $table->index('assigned_to');
            $table->index('status');
            $table->index('priority');
            $table->index('start_time');
            $table->index(['status', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cleaning_task');
    }
};
