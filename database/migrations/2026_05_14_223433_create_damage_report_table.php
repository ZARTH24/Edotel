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
        Schema::create('damage_report', function (Blueprint $table) {
            $table->id();
            $table->enum('lokasi', ['room', 'public area']);
            $table->foreignId('room_id')
                ->nullable()
                ->constrained('rooms')
                ->nullOnDelete();
            $table->string('ruangan', 200)->nullable();
            $table->text('issue');
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->enum('status', ['pending', 'in-progress', 'completed', 'cancelled'])->default('pending');
            $table->string('reported_by');
            $table->foreignId('assigned_to')->nullable()->constrained('users');
            $table->timestamp('reported_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->decimal('estimated_cost', 10, 2)->nullable();
            $table->decimal('actual_cost', 10, 2)->nullable();
            $table->timestamps();

            $table->index('room_id');
            $table->index('status');
            $table->index('priority');
            $table->index('assigned_to');
            $table->index('reported_by');
            $table->index('lokasi');
            $table->index('reported_at');
            $table->index(['status', 'priority']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_report');
    }
};
