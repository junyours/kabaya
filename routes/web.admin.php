<?php

use App\Http\Controllers\Kabaya\Web\Admin\DashboardController;
use App\Http\Controllers\Kabaya\Web\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'dashboard']);

  Route::get('/users/residents', [UserController::class, 'resident']);
  Route::get('/api/users/residents', [UserController::class, 'getResident']);
});