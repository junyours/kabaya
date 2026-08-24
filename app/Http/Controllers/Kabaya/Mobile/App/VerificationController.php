<?php

namespace App\Http\Controllers\Kabaya\Mobile\App;

use App\Http\Controllers\Controller;
use App\Models\UserVerification;
use App\Services\GoogleDriveService;
use Auth;
use DB;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Log;
use Throwable;

class VerificationController extends Controller
{
    public function __construct(
        protected GoogleDriveService $googleDrive
    ) {
    }

    public function verificationPersonal(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name' => ['required'],
            'suffix' => ['nullable'],
            'middle_name' => ['nullable'],
            'last_name' => ['required'],
            'birth_date' => ['required', 'date'],
            'sex' => ['required'],
            'marital_status' => ['required'],
            'religion' => ['required'],
        ]);

        $user->update($data);
    }

    public function verificationAddress(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'province' => ['required'],
            'municipality' => ['required'],
            'barangay' => ['required'],
            'postal_code' => ['required'],
        ]);

        $user->update($data);
    }

    public function identityVerification(Request $request)
    {
        $request->validate([
            'id_type' => [
                'required',
                'string',
                'max:100',
            ],

            'id_number' => [
                'required',
                'string',
                'max:100',
            ],

            'first_name' => [
                'required',
                'string',
                'max:100',
            ],

            'middle_name' => [
                'nullable',
                'string',
                'max:100',
            ],

            'last_name' => [
                'required',
                'string',
                'max:100',
            ],

            'date_of_birth' => [
                'required',
                'date',
            ],

            'address' => [
                'nullable',
                'string',
                'max:500',
            ],

            // IMPORTANT: these names must match React Native FormData
            'id_front_image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],

            'id_back_image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],

            'face_image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
        ]);

        $user = Auth::user();

        try {
            DB::beginTransaction();

            /*
            |--------------------------------------------------------------------------
            | FRONT ID
            |--------------------------------------------------------------------------
            */

            $frontImage = $request->file('id_front_image');

            if (!$frontImage) {
                throw new \Exception('Front ID image was not received.');
            }

            $frontImageId = $this->googleDrive->upload(
                $frontImage,
                'front'
            );

            /*
            |--------------------------------------------------------------------------
            | BACK ID
            |--------------------------------------------------------------------------
            */

            $backImage = $request->file('id_back_image');

            if (!$backImage) {
                throw new \Exception('Back ID image was not received.');
            }

            $backImageId = $this->googleDrive->upload(
                $backImage,
                'back'
            );

            /*
            |--------------------------------------------------------------------------
            | FACE IMAGE
            |--------------------------------------------------------------------------
            */

            $faceImage = $request->file('face_image');

            if (!$faceImage) {
                throw new \Exception('Face image was not received.');
            }

            $faceImageId = $this->googleDrive->upload(
                $faceImage,
                'face'
            );

            /*
            |--------------------------------------------------------------------------
            | SAVE VERIFICATION
            |--------------------------------------------------------------------------
            */

            $verification = UserVerification::create([
                'user_id' => $user->id,

                'id_type' => $request->id_type,

                'id_number' => $request->id_number,

                'first_name' => $request->first_name,

                'middle_name' => $request->middle_name,

                'last_name' => $request->last_name,

                'date_of_birth' => $request->date_of_birth,

                'address' => $request->address,

                'id_front_image' => $frontImageId,

                'id_back_image' => $backImageId,

                'face_image' => $faceImageId,

                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Identity verification submitted successfully.',
                'data' => $verification,
            ], 201);

        } catch (Throwable $e) {

            DB::rollBack();

            Log::error('User verification submission failed', [
                'user_id' => $user->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to submit your verification. Please try again.',
                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,
            ], 500);
        }
    }
}
