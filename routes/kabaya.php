<?php

use App\Http\Controllers\Kabaya\Mobile\App\DemographicController;
use App\Http\Controllers\Kabaya\Mobile\App\LinkSystemController;
use App\Http\Controllers\Kabaya\Mobile\App\Services\SBController;
use App\Http\Controllers\Kabaya\Mobile\App\Settings\ChangePinController;
use App\Http\Controllers\Kabaya\Mobile\App\VerificationController;
use App\Http\Controllers\Kabaya\Mobile\Auth\ForgotController;
use App\Http\Controllers\Kabaya\Mobile\Auth\LoginController;
use App\Http\Controllers\Kabaya\Mobile\Auth\SignInController;
use App\Http\Controllers\Kabaya\Mobile\Auth\SignUpController;
use App\Http\Controllers\Kabaya\Mobile\GlobalController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->prefix('kabaya/mobile')->group(function () {
  Route::get('/user', function (Request $request) {
    $user = $request->user();
    $deviceId = $request->device_id;

    $user->load([
      'user_session' => function ($query) use ($deviceId) {
        $query->where('device_id', $deviceId);
      },
      'latest_verification',
    ]);

    return $user;
  });

  Route::post('/login', [LoginController::class, 'login']);
  Route::post('/lock', [LoginController::class, 'lock']);
  Route::post('/biometric', [LoginController::class, 'biometric']);
  Route::post('/login/biometric', [LoginController::class, 'loginBiometric']);
  Route::get('/logout', [LoginController::class, 'logout']);
  Route::post('/check/pin', [LoginController::class, 'checkPin']);

  Route::post('/forgot-pin', [ForgotController::class, 'forgotPin']);
  Route::post('/forgot/verify-otp', [ForgotController::class, 'verifyOtp']);
  Route::post('/forgot/reset-pin', [ForgotController::class, 'resetPin']);

  Route::post('/verification/personal', [VerificationController::class, 'verificationPersonal']);
  Route::post('/verification/address', [VerificationController::class, 'verificationAddress']);
  Route::post('/verification/identity', [VerificationController::class, 'identityVerification']);

  Route::get('/services/sb/get-folder', [SBController::class, 'getFolder']);
  Route::get('/services/sb/get-pdf/{id}', [SBController::class, 'getPdf']);
  Route::get('/services/sb/preview-pdf/{id}', [SBController::class, 'previewPdf']);

  Route::get('/link-systems', [LinkSystemController::class, 'getLinkSystem']);

  Route::post('/settings/change-pin', [ChangePinController::class, 'changePin']);

  Route::get('/demographics', [DemographicController::class, 'index']);
});

Route::middleware(['guest'])->prefix('kabaya/mobile')->group(function () {
  Route::get('/get-residents', [SignUpController::class, 'getResident']);
  Route::post('/sign-up', [SignUpController::class, 'signUp']);
  Route::post('/sign-up/verify-otp', [SignUpController::class, 'verifyOtp']);
  Route::post('/sign-up/create-pin', [SignUpController::class, 'createPin']);

  Route::post('/sign-in', [SignInController::class, 'signIn']);
  Route::post('/sign-in/verify-otp', [SignInController::class, 'verifyOtp']);
});

Route::post('/resend-otp', [GlobalController::class, 'resendOtp']);