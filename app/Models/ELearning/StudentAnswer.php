<?php

namespace App\Models\ELearning;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAnswer extends Model
{
    protected $table = 'student_answers';

    protected $fillable = [
        'user_id',
        'exercise_id',
        'answers',
        'score',
        'is_completed',
        'attempt',
    ];

    protected $casts = [
        'answers' => 'array',
        'score' => 'integer',
        'is_completed' => 'boolean',
        'attempt' => 'integer',
    ];

    /**
     * Get the user this answer belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the exercise this answer belongs to.
     */
    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }

    /**
     * Increment attempt count.
     */
    public function incrementAttempt(): void
    {
        $this->increment('attempt');
    }

    /**
     * Get latest answer for a user and exercise.
     */
    public static function getLatest($userId, $exerciseId)
    {
        return static::where('user_id', $userId)
            ->where('exercise_id', $exerciseId)
            ->latest()
            ->first();
    }
}
