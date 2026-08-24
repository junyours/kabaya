<?php

namespace App\Http\Controllers\Kabaya\Mobile\App\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ChangePinController extends Controller
{
    public function changePin(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'password' => ['required', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($data['password']),
        ]);
    }
}
