<?php

namespace App\Models\HouseKeeping;

use App\Models\FrontOffice\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CleaningTask extends Model
{
    protected $table = "cleaning_task";

    protected $fillable = ['room_id', 'assigned_to', 'status', 'priority', 'notes', 'start_time', 'end_time', 'inspected_by', 'inspected_at'];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function assign()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function inspect()
    {
        return $this->belongsTo(User::class, 'inspected_by');
    }
}
