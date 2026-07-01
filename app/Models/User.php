<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\DamageReport\DamageReports;
use App\Models\HouseKeeping\CleaningTask;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'is_active',
        'phone',
        'is_menu_unlocked',
        'unlocked_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function assignedTasks()
    {
        return $this->hasMany(CleaningTask::class, 'assigned_to');
    }

    public function tasks()
    {
        if ($this->role === 'housekeeping') {
            return $this->hasMany(CleaningTask::class, 'assigned_to');
        } elseif ($this->role === 'engineering') {
            return $this->hasMany(DamageReports::class, 'assigned_to');
        }

        // Default kosong untuk role lain
        return $this->hasMany(CleaningTask::class, 'assigned_to')->whereRaw('0 = 1');
    }
}
