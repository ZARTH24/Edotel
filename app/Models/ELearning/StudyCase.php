<?php

namespace App\Models\ELearning;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudyCase extends Model
{
    protected $table = 'study_cases';

    protected $fillable = [
        'exercise_id',
        'title',
        'content',
        'estimated_time',
    ];

    protected $casts = [
        'estimated_time' => 'integer',
    ];

    /**
     * Get the exercise this study case belongs to.
     */
    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class);
    }
}
