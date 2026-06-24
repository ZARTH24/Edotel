<?php

namespace App\Models\FrontOffice;

use App\Models\DamageReport\DamageReports;
use App\Models\HouseKeeping\CleaningTask;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Room extends Model
{
    use SoftDeletes;

    protected $table = "rooms";
    protected $fillable = ['number', 'type', 'status', 'floor', 'price', 'features'];

    public function reservations()
    {
        return $this->hasMany(Reservation::class); // 1 room bisa punya banyak reservation
    }

    public function cleaningTasks()
    {
        return $this->hasMany(CleaningTask::class, 'room_id', 'id');
    }

    public function maintenanceTasks()
    {
        return $this->hasMany(DamageReports::class);
    }

    protected $casts = [
        'features' => 'array', // Laravel otomatis convert array <-> JSON
        'price' => 'decimal:2',
    ];

    protected $appends = ['price_rupiah'];
    // Accessor untuk price dalam format rupiah
    public function getPriceRupiahAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }
}
