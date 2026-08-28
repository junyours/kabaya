<?php

namespace App\Http\Controllers\Kabaya\Web\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\ApiClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function key()
    {
        return Inertia::render('app/super-admin/clients/key', [
            'apiClient' => ApiClient::first([
                'id',
                'key',
            ]),
        ]);
    }

    public function generate()
    {
        $key = 'client_' . Str::random(32);
        $secret = Str::random(64);

        ApiClient::query()->delete();

        ApiClient::create([
            'key' => $key,
            'secret' => Hash::make($secret),
        ]);

        return response()->json([
            'api_key' => "{$key}.{$secret}",
        ]);
    }
}
