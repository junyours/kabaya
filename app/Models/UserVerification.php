<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserVerification extends Model
{
    use HasFactory;

    protected $table = 'user_verifications';

    protected $fillable = [
        'user_id',
        'id_type',
        'id_number',
        'last_name',
        'first_name',
        'middle_name',
        'date_of_birth',
        'address',
        'id_front_image',
        'id_back_image',
        'face_image',
        'status',
        'remarks',
        'verified_at',
        'rejected_at',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}