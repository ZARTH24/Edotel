<?php

namespace App\Models\FrontOffice;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $table = "reservations";

    protected $fillable = [
        'booking_reference',
        'guest_id',
        'room_id',
        'check_in',
        'check_out',
        'status',
        'total_price',
        'misc_details',
        'special_requests',
        'payment_status',
        'payment_method',
        'number_of_guests',
        'created_by',
        'checked_in_at',
        'checked_out_at',
    ];

    public static function generateBookingReference(): string
    {
        $date = now()->format('Ymd');
        $prefix = "INV-{$date}-";

        $last = static::where('booking_reference', 'like', "{$prefix}%")
            ->orderBy('booking_reference', 'desc')
            ->value('booking_reference');

        if ($last) {
            $lastNumber = (int) substr($last, -4);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }

        return $prefix . $newNumber;
    }

    protected $casts = [
        'misc_details' => 'array',
        'check_in' => 'date',
        'check_out' => 'date',
        'checked_in_at' => 'datetime',
        'checked_out_at' => 'datetime',
    ];

    protected $appends = ['total_price_rupiah'];

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function getTotalPriceRupiahAttribute()
    {
        return 'Rp ' . number_format($this->total_price, 0, ',', '.');
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (empty($search)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($search) {
            $q->whereHas('guest', fn(Builder $inner) => $inner->where('name', 'like', "%{$search}%"))
                ->orWhereHas('room', fn(Builder $inner) => $inner->where('number', 'like', "%{$search}%"));
        });
    }
}
