<?php

namespace App\Http\Controllers\Api\External;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getVerifiedUserByIdNumber(Request $request)
    {
        $user = User::query()
            ->select([
                'id',
                'id_number',
                'first_name',
                'middle_name',
                'last_name',
                'suffix',
                'sex',
                'marital_status',
                'birth_date',
                'religion',
                'mobile_number',
                'email',
                'province',
                'municipality',
                'barangay',
                'street_name',
                'postal_code',
                'is_verified',
                'role',
                'is_resident',
            ])
            ->where('is_verified', true)
            ->where('is_resident', true)
            ->where('id_number', $request->id_number)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Verified resident not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ], 200);
    }
}