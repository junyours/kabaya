<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WebController::class, 'home']);

// web
Route::middleware(['auth:sanctum'])->group(function () {
  Route::get('/dashboard', [AppController::class, 'dashboard']);

  Route::get('/users/residents', [AppController::class, 'resident']);

  Route::get('/services/link-systems', [AppController::class, 'linkSystem']);

  Route::get('/requests/user-verifications', [AppController::class, 'userVerification']);
});

// api's
Route::middleware(['auth:sanctum'])->group(function () {
  Route::get('/api/users/residents', [AppController::class, 'getResident']);

  Route::get('/api/services/link-systems', [AppController::class, 'getLinkSystem']);
  Route::post('/api/services/add/link-systems', [AppController::class, 'addLinkSystem']);
  Route::post('/api/services/update/link-systems/{id}', [AppController::class, 'updateLinkSystem']);

  Route::get('/api/requests/user-verifications', [AppController::class, 'getUserVerification']);
  Route::get('/api/requests/user-verifications/{user}', [AppController::class, 'getUserVerificationDetails']);
  Route::post('/api/requests/user-verifications/{verification}/approve', [AppController::class, 'approveUserVerification']);
  Route::post('/api/requests/user-verifications/{verification}/reject', [AppController::class, 'rejectUserVerification']);
});

require __DIR__ . '/auth.php';
