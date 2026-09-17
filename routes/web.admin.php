<?php

use App\Http\Controllers\Kabaya\Web\Admin\DashboardController;
use App\Http\Controllers\Kabaya\Web\Admin\RequestController;
use App\Http\Controllers\Kabaya\Web\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'dashboard']);

  Route::get('/users/residents', [UserController::class, 'resident']);
  Route::get('/api/users/residents', [UserController::class, 'getResident']);

  Route::get('/requests/user-verifications', [RequestController::class, 'userVerification']);
  Route::get('/api/requests/user-verifications', [RequestController::class, 'getUserVerification']);
  Route::get('/api/requests/user-verifications/{user}', [RequestController::class, 'getUserVerificationDetails']);
  Route::post('/api/requests/user-verifications/{verification}/approve', [RequestController::class, 'approveUserVerification']);
  Route::post('/api/requests/user-verifications/{verification}/reject', [RequestController::class, 'rejectUserVerification']);
});