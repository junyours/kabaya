<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class ApiClient extends Model
{
    protected $fillable = [
        'key',
        'secret',
    ];

    protected $hidden = [
        'secret',
    ];

    public function checkSecret(string $secret): bool
    {
        return Hash::check($secret, $this->secret);
    }
}
