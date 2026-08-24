<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Client\ConnectionException;
use Exception;

class GoogleDriveService
{
  /**
   * Get Google OAuth access token.
   */
  public function token(): string
  {
    try {
      $response = Http::asForm()
        ->post('https://oauth2.googleapis.com/token', [
          'client_id' => config('services.google.client_id'),
          'client_secret' => config('services.google.client_secret'),
          'refresh_token' => config('services.google.refresh_token'),
          'grant_type' => 'refresh_token',
        ]);

      if (!$response->successful()) {
        Log::error('Google OAuth token error', [
          'status' => $response->status(),
          'response' => $response->body(),
        ]);

        throw new Exception('Unable to get Google access token.');
      }

      return $response->json('access_token');

    } catch (ConnectionException $e) {
      Log::error('Google token connection error', [
        'message' => $e->getMessage(),
      ]);

      throw new Exception(
        'Unable to connect to Google services.'
      );
    }
  }

  /**
   * Find or create a folder.
   */
  public function getOrCreateFolder(
    string $accessToken,
    string $folderName,
    string $parentId
  ): string {
    try {
      $response = Http::withToken($accessToken)
        ->get(
          'https://www.googleapis.com/drive/v3/files',
          [
            'q' =>
              "name='{$folderName}' and " .
              "'{$parentId}' in parents and " .
              "mimeType='application/vnd.google-apps.folder' and " .
              "trashed=false",

            'fields' => 'files(id,name)',
          ]
        );

      if ($response->successful()) {
        $files = $response->json('files', []);

        if (count($files) > 0) {
          return $files[0]['id'];
        }
      }

      /**
       * Folder does not exist.
       * Create it.
       */
      $create = Http::withToken($accessToken)
        ->post(
          'https://www.googleapis.com/drive/v3/files',
          [
            'name' => $folderName,
            'mimeType' =>
              'application/vnd.google-apps.folder',
            'parents' => [$parentId],
          ]
        );

      if (!$create->successful()) {
        Log::error('Google Drive folder creation failed', [
          'folder' => $folderName,
          'response' => $create->body(),
        ]);

        throw new Exception(
          'Failed to create Google Drive folder.'
        );
      }

      return $create->json('id');

    } catch (ConnectionException $e) {
      Log::error('Google Drive connection error', [
        'message' => $e->getMessage(),
      ]);

      throw new Exception(
        'Unable to connect to Google Drive.'
      );
    }
  }

  /**
   * Upload a file to Google Drive.
   */
  public function upload(
    UploadedFile $file,
    string $folderName,
    ?string $parentFolderId = null
  ): string {
    $accessToken = $this->token();

    $parentFolderId ??=
      config('services.google.user_verification_folder_id');

    $folderId = $this->getOrCreateFolder(
      $accessToken,
      $folderName,
      $parentFolderId
    );

    $mimeType = $file->getMimeType();

    $metadata = [
      'name' => 'temp_' . time(),
      'parents' => [$folderId],
    ];

    $uploadResponse = Http::withToken($accessToken)
      ->attach(
        'metadata',
        json_encode($metadata),
        'metadata.json',
        [
          'Content-Type' => 'application/json',
        ]
      )
      ->attach(
        'media',
        file_get_contents($file->getRealPath()),
        $file->getClientOriginalName(),
        [
          'Content-Type' => $mimeType,
        ]
      )
      ->post(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
      );

    if (!$uploadResponse->successful()) {
      Log::error('Google Drive upload failed', [
        'status' => $uploadResponse->status(),
        'response' => $uploadResponse->body(),
      ]);

      throw new Exception(
        'Failed to upload file to Google Drive.'
      );
    }

    $fileId = $uploadResponse->json('id');

    /**
     * Rename file to Google Drive file ID.
     */
    Http::withToken($accessToken)
      ->patch(
        "https://www.googleapis.com/drive/v3/files/{$fileId}",
        [
          'name' => $fileId,
        ]
      );

    /**
     * Make file publicly readable.
     */
    Http::withToken($accessToken)
      ->post(
        "https://www.googleapis.com/drive/v3/files/{$fileId}/permissions",
        [
          'role' => 'reader',
          'type' => 'anyone',
        ]
      );

    return $fileId;
  }
}