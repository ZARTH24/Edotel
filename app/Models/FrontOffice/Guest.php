<?php

namespace App\Models\FrontOffice;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Guest extends Model
{
    protected $table = "guests";

    protected $fillable = ['name', 'email', 'phone', 'nationality', 'id_number', 'id_type', 'address', 'date_of_birth'];

    // Relasi ke Reservation
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
