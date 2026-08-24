<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Models\OtpVerification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

abstract class Controller
{
  public function otp($user_id)
  {
    $user = User::findOrFail($user_id);

    do {
      $otp = random_int(100000, 999999);
    } while (
      OtpVerification::query()
        ->where('otp', $otp)
        ->exists()
    );

    OtpVerification::create([
      'user_id' => $user_id,
      'otp' => $otp,
      'expired_at' => Carbon::now()->addMinutes(3),
    ]);

    Mail::to($user->email)->send(new OtpMail($otp));
  }

  public function verify($data)
  {
    $record = OtpVerification::whereHas('user', function ($query) use ($data) {
      $query->where('email', $data['email']);
    })
      ->latest()
      ->first();

    if ($record->expired_at->isPast()) {
      throw ValidationException::withMessages([
        'otp' => 'Your OTP has expired. Please request a new one.'
      ]);
    }

    if ($record->otp !== $data['otp']) {
      throw ValidationException::withMessages([
        'otp' => 'The OTP you entered is invalid. Please try again.'
      ]);
    }

    OtpVerification::where('user_id', $record->user_id)->delete();
  }

  public function token()
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
        return back()->with(
          'error',
          'Unable to connect to Google services. Please try again.'
        );
      }

      return $response->json()['access_token'];

    } catch (ConnectionException $e) {
      Log::error('Google token connection error', [
        'message' => $e->getMessage(),
      ]);

      return back()->with(
        'error',
        'Network error detected. Please check your internet connection.'
      );
    }
  }

  public function getOrCreateFolder($accessToken, $folderName, $parentId)
  {
    try {
      $response = Http::withToken($accessToken)
        ->get('https://www.googleapis.com/drive/v3/files', [
          'q' => "name='{$folderName}' and '{$parentId}' in parents 
                            and mimeType='application/vnd.google-apps.folder' 
                            and trashed=false",
          'fields' => 'files(id)',
        ]);

      if ($response->successful() && count($response['files']) > 0) {
        return $response['files'][0]['id'];
      }

      $create = Http::withToken($accessToken)
        ->post('https://www.googleapis.com/drive/v3/files', [
          'name' => $folderName,
          'mimeType' => 'application/vnd.google-apps.folder',
          'parents' => [$parentId],
        ]);

      if (!$create->successful()) {
        return back()->with(
          'error',
          'Failed to create folder. Please try again.'
        );
      }

      return $create->json()['id'];

    } catch (ConnectionException $e) {
      Log::error('Google Drive connection error', [
        'message' => $e->getMessage(),
      ]);

      return back()->with(
        'error',
        'Slow or no internet connection. Please try again later.'
      );
    }
  }
}
