<?php

namespace App\Models\DamageReport;

use App\Models\FrontOffice\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DamageReports extends Model
{
    protected $table = "damage_report";

    protected $fillable = ['lokasi', 'room_id', 'ruangan', 'issue', 'priority', 'status', 'reported_by', 'reported_at', 'assigned_to', 'started_at', 'completed_at', 'resolution_notes', 'estimated_cost', 'actual_cost'];

    // User yang ditugaskan mengerjakan
    public function assign(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    // Relasi ke Room (juga Many-to-One)
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    protected $appends = ['estimated_rupiah', 'actual_rupiah'];
    // Accessor untuk price dalam format rupiah
    public function getEstimatedRupiahAttribute()
    {
        return 'Rp ' . number_format($this->estimated_cost, 0, ',', '.');
    }
    public function getActualRupiahAttribute()
    {
        return 'Rp ' . number_format($this->actual_cost, 0, ',', '.');
    }
}
