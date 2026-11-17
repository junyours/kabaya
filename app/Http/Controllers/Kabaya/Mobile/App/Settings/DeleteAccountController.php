<?php

namespace App\Http\Controllers\Kabaya\Mobile\App\Settings;

use App\Http\Controllers\Controller;
use App\Models\AccountDeletionRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DeleteAccountController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'password' => ['required', 'digits:4'],
        ]);

        $user = $request->user();

        // Verify the user's current PIN.
        if (!Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'The PIN you entered is incorrect.',
                'errors' => [
                    'password' => ['Incorrect PIN. Please try again.'],
                ],
            ], 422);
        }

        // Prevent duplicate pending requests.
        $existingRequest = AccountDeletionRequest::where('user_id', $user->id)
            ->where('status', 'pending')
            ->exists();

        if ($existingRequest) {
            return response()->json([
                'message' => 'You already have a pending account deletion request.',
            ], 409);
        }

        // Create the deletion request.
        $deletionRequest = AccountDeletionRequest::create([
            'user_id' => $user->id,
            'name' => trim(
                ($user->first_name ?? '') . ' ' .
                ($user->last_name ?? '')
            ),
            'email' => $user->email,
            'id_number' => $user->id_number,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Your account deletion request has been submitted successfully. Please wait for administrator review.',
            'data' => [
                'id' => $deletionRequest->id,
                'status' => $deletionRequest->status,
                'created_at' => $deletionRequest->created_at,
            ],
        ], 201);
    }

    public function status(Request $request)
    {
        $deletionRequest = AccountDeletionRequest::where(
            'user_id',
            $request->user()->id
        )
            ->latest()
            ->first();

        return response()->json([
            'success' => true,
            'data' => $deletionRequest,
        ]);
    }
}
