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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 20)->unique()->nullable();
            $table->foreignId('guest_id')->constrained('guests')->onDelete('restrict');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('restrict');
            $table->date('check_in');
            $table->date('check_out');
            $table->enum('status', ['confirmed', 'checked-in', 'checked-out', 'cancelled'])->default('confirmed');
            $table->decimal('total_price', 12, 2);
            $table->json('misc_details')->nullable();
            $table->text('special_requests')->nullable();
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'refunded'])->default('pending');
            $table->enum('payment_method', ['cash', 'transfer', 'credit_card'])->default('cash');
            $table->integer('number_of_guests')->default(1);
            $table->uuid('created_by')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('checked_out_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('booking_reference');
            $table->index('guest_id');
            $table->index('room_id');
            $table->index('check_in');
            $table->index('check_out');
            $table->index('status');
            $table->index('payment_status');
            $table->index('created_by');
            $table->index(['check_in', 'check_out', 'status']);
            $table->index(['check_in', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
