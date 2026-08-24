<?php

namespace App\Http\Controllers;

use App\Models\LinkSystem;
use App\Models\User;
use App\Models\UserVerification;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Log;
use Throwable;

class AppController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('app/dashboard');
    }

    public function resident()
    {
        return Inertia::render('app/users/resident');
    }

    public function getResident(Request $request)
    {
        $search = $request->input('search');

        $residents = User::select(
            'id',
            'id_number',
            'first_name',
            'middle_name',
            'last_name',
            'suffix',
            'is_verified',
            'is_resident'
        )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('id_number', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%");
                });
            })
            ->where('role', 'user')
            ->whereNotNull('is_verified')
            ->paginate(50);

        return response()->json($residents);
    }

    public function linkSystem()
    {
        return Inertia::render('app/services/link-system');
    }

    public function getLinkSystem(Request $request)
    {
        $search = $request->input('search');

        $systems = LinkSystem::select(
            'id',
            'label',
            'icon',
            'href',
            'is_active',
        )
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('label', 'like', "%{$search}%");
                });
            })
            ->paginate(10);

        return response()->json($systems);
    }

    public function addLinkSystem(Request $request)
    {
        $accessToken = $this->token();

        $data = $request->validate([
            'label' => ['required'],
            'icon' => ['required', 'image', 'mimes:jpg,jpeg,png'],
            'href' => ['required'],
            'is_active' => ['required'],
        ]);

        if ($request->hasFile('icon')) {
            $folderId = config('services.google.link_system_folder_id');

            $parentFolderId = $this->getOrCreateFolder($accessToken, 'icons', $folderId);

            $file = $request->file('icon');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$parentFolderId],
            ];

            $uploadResponse = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadResponse->successful()) {
                $fileId = $uploadResponse->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $data['icon'] = $fileId;
            }
        }

        LinkSystem::create($data);
    }

    public function updateLinkSystem(Request $request)
    {
        $accessToken = $this->token();

        $system = LinkSystem::findOrFail($request->id);

        $request->validate([
            'label' => ['required'],
            'icon' => ['nullable', 'image', 'mimes:jpg,jpeg,png'],
            'href' => ['required'],
            'is_active' => ['required'],
        ]);

        if ($request->hasFile('icon')) {

            if ($system->icon) {
                Http::withToken($accessToken)->delete("https://www.googleapis.com/drive/v3/files/{$system->icon}");
            }

            $folderId = config('services.google.link_system_folder_id');

            $parentFolderId = $this->getOrCreateFolder($accessToken, 'icons', $folderId);

            $file = $request->file('icon');
            $mimeType = $file->getMimeType();

            $metadata = [
                'name' => 'temp_' . time(),
                'parents' => [$parentFolderId],
            ];

            $uploadResponse = Http::withToken($accessToken)
                ->attach('metadata', json_encode($metadata), 'metadata.json', ['Content-Type' => 'application/json'])
                ->attach('media', file_get_contents($file), $file->getClientOriginalName(), ['Content-Type' => $mimeType])
                ->post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');

            if ($uploadResponse->successful()) {
                $fileId = $uploadResponse->json()['id'];

                Http::withToken($accessToken)->patch("https://www.googleapis.com/drive/v3/files/{$fileId}", [
                    'name' => $fileId,
                ]);

                Http::withToken($accessToken)->post("https://www.googleapis.com/drive/v3/files/{$fileId}/permissions", [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]);

                $system->update([
                    'icon' => $fileId
                ]);
            }
        }

        $system->update([
            'label' => $request->label,
            'href' => $request->href,
            'is_active' => $request->is_active,
        ]);
    }

    /**
     * User verification page.
     */
    public function userVerification()
    {
        return inertia('app/requests/user-verification');
    }

    /**
     * Get users with their latest verification.
     */
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

            ->with([
                'latest_verification',
            ])

            ->latest()

            ->paginate(50);

        return response()->json($users);
    }

    /**
     * Get a specific user's verification details.
     */
    public function getUserVerificationDetails(User $user)
    {
        if ($user->role !== 'user') {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user.',
            ], 404);
        }

        $user->load([
            'latest_verification',
        ]);

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

    /**
     * Approve verification.
     */
    public function approveUserVerification(
        Request $request,
        UserVerification $verification
    ) {
        try {
            DB::beginTransaction();

            // Prevent approving something that does not belong to a user.
            $verification->load('user');

            if (!$verification->user) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'User associated with this verification was not found.',
                ], 404);
            }

            /*
             * Only pending requests can be approved.
             */
            if ($verification->status !== 'pending') {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'This verification request has already been processed.',
                ], 422);
            }

            /*
             * Approve verification.
             */
            $verification->update([
                'status' => 'approved',
                'remarks' => null,
                'verified_at' => now(),
                'rejected_at' => null,
            ]);

            /*
             * Fully verified user.
             */
            $verification->user->update([
                'is_verified' => 1,
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

    /**
     * Reject verification.
     */
    public function rejectUserVerification(
        Request $request,
        UserVerification $verification
    ) {
        $validated = $request->validate([
            'remarks' => [
                'nullable',
                'string',
                'max:1000',
            ],
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

            /*
             * Only pending requests can be rejected.
             */
            if ($verification->status !== 'pending') {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'This verification request has already been processed.',
                ], 422);
            }

            /*
             * Reject verification.
             */
            $verification->update([
                'status' => 'rejected',
                'remarks' => $validated['remarks'] ?? null,
                'verified_at' => null,
                'rejected_at' => now(),
            ]);

            /*
             * User is no longer fully verified.
             *
             * If your application uses:
             * null = Not Verified
             * 0 = Semi Verified
             * 1 = Fully Verified
             *
             * use 0 here if rejected users should be semi-verified.
             */
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
