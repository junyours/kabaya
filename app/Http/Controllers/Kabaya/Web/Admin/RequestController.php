<?php

namespace App\Http\Controllers\Kabaya\Web\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Throwable;

class RequestController extends Controller
{
    public function userVerification()
    {
        return Inertia::render('app/admin/requests/user-verification');
    }

    public function getUserVerification(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $users = User::query()
            ->where('role', 'user')
            ->whereHas('latest_verification', function ($query) use ($status) {
                if ($status) {
                    $query->where('status', $status);
                }
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id_number', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%");
                });
            })
            ->with('latest_verification')
            ->latest()
            ->paginate(50);

        return response()->json($users);
    }

    public function getUserVerificationDetails(User $user)
    {
        if ($user->role !== 'user') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user.',
            ], 404);
        }

        $user->load('latest_verification');

        if (!$user->latest_verification) {
            return response()->json([
                'success' => false,
                'message' => 'No verification request found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    public function approveUserVerification(
        Request $request,
        UserVerification $verification
    ) {
        $validated = $request->validate([
            'is_resident' => ['required', 'boolean'],
        ]);

        try {
            DB::beginTransaction();

            $verification->load('user');

            if (!$verification->user) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'User associated with this verification was not found.',
                ], 404);
            }

            if ($verification->status !== 'pending') {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'This verification request has already been processed.',
                ], 422);
            }

            $verification->update([
                'status' => 'approved',
                'remarks' => null,
                'verified_at' => now(),
                'rejected_at' => null,
            ]);

            $verification->user->update([
                'is_verified' => 1,
                'is_resident' => $validated['is_resident'],
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Verification approved successfully.',
                'data' => $verification->fresh()->load('user'),
            ]);
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Failed to approve user verification', [
                'verification_id' => $verification->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to approve verification.',
            ], 500);
        }
    }

    public function rejectUserVerification(
        Request $request,
        UserVerification $verification
    ) {
        $validated = $request->validate([
            'remarks' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            DB::beginTransaction();

            $verification->load('user');

            if (!$verification->user) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'User associated with this verification was not found.',
                ], 404);
            }

            if ($verification->status !== 'pending') {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'This verification request has already been processed.',
                ], 422);
            }

            $verification->update([
                'status' => 'rejected',
                'remarks' => $validated['remarks'] ?? null,
                'verified_at' => null,
                'rejected_at' => now(),
            ]);

            $verification->user->update([
                'is_verified' => 0,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Verification rejected successfully.',
                'data' => $verification->fresh()->load('user'),
            ]);
        } catch (Throwable $e) {
            DB::rollBack();

            Log::error('Failed to reject user verification', [
                'verification_id' => $verification->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to reject verification.',
            ], 500);
        }
    }
}
