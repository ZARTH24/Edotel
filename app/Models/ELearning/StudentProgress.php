<?php

namespace App\Models\ELearning;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProgress extends Model
{
    protected $table = 'student_progress';

    protected $fillable = [
        'user_id',
        'exercise_id',
        'status',
        'completed_at',
    ];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    /**
     * Status constants.
     */
    const STATUS_LOCKED = 'locked';
    const STATUS_OPENED = 'opened';
    const STATUS_COMPLETED = 'completed';

    /**
     * Get the user this progress belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the exercise this progress belongs to.
     */
    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    /**
     * Check if this progress is locked.
     */
    public function isLocked(): bool
    {
        return $this->status === self::STATUS_LOCKED;
    }

    /**
     * Check if this progress is opened.
     */
    public function isOpened(): bool
    {
        return $this->status === self::STATUS_OPENED;
    }

    /**
     * Check if this progress is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Mark this progress as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark this progress as opened.
     */
    public function markAsOpened(): void
    {
        $this->update([
            'status' => self::STATUS_OPENED,
        ]);
    }

    /**
     * Scope for locked status.
     */
    public function scopeLocked($query)
    {
        return $query->where('status', self::STATUS_LOCKED);
    }

    /**
     * Scope for opened status.
     */
    public function scopeOpened($query)
    {
        return $query->where('status', self::STATUS_OPENED);
    }

    /**
     * Scope for completed status.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }
}
