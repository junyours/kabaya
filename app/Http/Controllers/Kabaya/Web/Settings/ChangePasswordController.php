<?php

namespace App\Http\Controllers\Kabaya\Web\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChangePasswordController extends Controller
{
    public function index()
    {
        return Inertia::render('app/settings/change-password');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'current_password' => [
                'required',
                'current_password',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],
        ]);

        $user = $request->user();

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }
}
