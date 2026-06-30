<?php

namespace App\Models\ELearning;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Exercise extends Model
{
    protected $table = 'exercises';

    protected $fillable = [
        'category',
        'title',
        'slug',
        'document_path',
        'order_number',
    ];

    protected $casts = [
        'order_number' => 'integer',
    ];

    /**
     * Get the study case for this exercise.
     */
    public function studyCase(): HasOne
    {
        return $this->hasOne(StudyCase::class);
    }

    /**
     * Get all student progress for this exercise.
     */
    public function studentProgress(): HasMany
    {
        return $this->hasMany(StudentProgress::class);
    }

    /**
     * Get all student answers for this exercise.
     */
    public function studentAnswers(): HasMany
    {
        return $this->hasMany(StudentAnswer::class);
    }

    /**
     * Scope for reception category.
     */
    public function scopeReception($query)
    {
        return $query->where('category', 'reception');
    }

    /**
     * Scope for reservation category.
     */
    public function scopeReservation($query)
    {
        return $query->where('category', 'reservation');
    }

    /**
     * Scope ordered by order_number.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_number', 'asc');
    }
}
