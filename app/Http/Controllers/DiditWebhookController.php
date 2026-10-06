<?php

namespace App\Http\Controllers;

use App\Models\UserVerification;
use App\Services\GoogleDriveService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class DiditWebhookController extends Controller
{
    public function __construct(
        protected GoogleDriveService $googleDrive
    ) {
    }

    public function handle(Request $request)
    {
        $payload = $request->getContent();

        $signature = $request->header('X-Signature-V2');

        if (!$this->isValidSignature($payload, $signature)) {
            return response()->json([
                'message' => 'Invalid signature',
            ], 401);
        }

        $data = json_decode($payload, true);

        if (!$data) {
            return response()->json([
                'message' => 'Invalid payload',
            ], 400);
        }

        $userId = $data['vendor_data'];

        if (!$userId) {
            return response()->json([
                'message' => 'Missing vendor_data',
            ], 400);
        }

        $verification = $data['decision']['id_verifications'][0];
        $liveness = $data['decision']['liveness_checks'][0];

        if (!$verification) {
            return response()->json([
                'message' => 'Missing verification data',
            ], 400);
        }

        $frontImageUrl = $verification['front_image'];
        $backImageUrl = $verification['back_image'];
        $faceImageUrl = $liveness['reference_image'];

        $frontImage = null;
        $backImage = null;
        $faceImage = null;

        try {
            if ($frontImageUrl) {
                $frontImage = $this->downloadTemporaryImage(
                    $frontImageUrl,
                    'front'
                );
            }

            if ($backImageUrl) {
                $backImage = $this->downloadTemporaryImage(
                    $backImageUrl,
                    'back'
                );
            }

            if ($faceImageUrl) {
                $faceImage = $this->downloadTemporaryImage(
                    $faceImageUrl,
                    'face'
                );
            }

            $frontImageId = null;
            $backImageId = null;
            $faceImageId = null;

            if ($frontImage) {
                $frontImageId = $this->googleDrive->upload(
                    $frontImage,
                    'front'
                );
            }

            if ($backImage) {
                $backImageId = $this->googleDrive->upload(
                    $backImage,
                    'back'
                );
            }

            if ($faceImage) {
                $faceImageId = $this->googleDrive->upload(
                    $faceImage,
                    'face'
                );

                $ProfilePictureId = $this->googleDrive->upload(
                    $faceImage,
                    'profile'
                );
            }

            $userVerification = UserVerification::updateOrCreate(
                [
                    'user_id' => $userId,
                ],
                [
                    'id_type' => $verification['document_type'],
                    'id_number' => $verification['document_number'],
                    'full_name' => $verification['full_name'],
                    'date_of_birth' => $verification['date_of_birth'],
                    'address' => $verification['address'],
                    'id_front_image' => $frontImageId,
                    'id_back_image' => $backImageId,
                    'face_image' => $faceImageId,
                    'status' => $data['status'],
                ]
            );

            $user = $userVerification->user;

            $user->update([
                'profile_picture' => $ProfilePictureId,
            ]);

            if ($userVerification->status === 'Approved') {
                $user->update([
                    'is_verified' => true,
                ]);

                $address = strtolower($verification['address'] ?? '');

                if (str_contains($address, 'opol')) {
                    $user->update([
                        'is_resident' => true,
                    ]);
                } else {
                    $user->update([
                        'is_resident' => false,
                    ]);
                }
            }

        } catch (\Throwable $e) {
            throw new \Exception(
                $e->getMessage()
            );
        } finally {
            foreach ([
                $frontImage,
                $backImage,
                $faceImage,
            ] as $file) {

                if ($file instanceof UploadedFile) {
                    $path = $file->getRealPath();

                    if ($path && File::exists($path)) {
                        File::delete($path);
                    }
                }
            }
        }
    }

    private function isValidSignature(
        string $payload,
        ?string $signature
    ): bool {
        if (!$signature) {
            return false;
        }

        $expected = hash_hmac(
            'sha256',
            $payload,
            config('services.didit.webhook_secret')
        );

        return hash_equals($expected, $signature);
    }

    private function downloadTemporaryImage(
        string $url,
        string $name
    ): UploadedFile {
        $response = Http::timeout(30)
            ->retry(3, 1000)
            ->get($url);

        if (!$response->successful()) {
            throw new \Exception(
                "Failed to download {$name} image. HTTP {$response->status()}"
            );
        }

        $contentType = $response->header('Content-Type');

        $extension = match ($contentType) {
            'image/jpeg',
            'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => 'jpg',
        };

        $filename = $name . '_' . Str::uuid() . '.' . $extension;
        $directory = storage_path('app/temp');
        File::ensureDirectoryExists($directory);
        $path = $directory . '/' . $filename;

        File::put(
            $path,
            $response->body()
        );

        return new UploadedFile(
            $path,
            $filename,
            $contentType,
            null,
            true
        );
    }
}