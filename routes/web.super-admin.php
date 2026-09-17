<?php

use App\Http\Controllers\Kabaya\Web\SuperAdmin\ClientController;
use App\Http\Controllers\Kabaya\Web\SuperAdmin\DashboardController;
use App\Http\Controllers\Kabaya\Web\SuperAdmin\ServiceController;
use App\Http\Controllers\Kabaya\Web\SuperAdmin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:super_admin'])->prefix('super-admin')->group(function () {
  Route::get('/dashboard', [DashboardController::class, 'dashboard']);

  Route::get('/services/link-systems', [ServiceController::class, 'linkSystem']);
  Route::get('/api/services/link-systems', [ServiceController::class, 'getLinkSystem']);
  Route::post('/api/services/add/link-systems', [ServiceController::class, 'addLinkSystem']);
  Route::post('/api/services/update/link-systems/{id}', [ServiceController::class, 'updateLinkSystem']);

  Route::get('/clients/keys', [ClientController::class, 'key']);
  Route::post('/clients/keys/generate', [ClientController::class, 'generate']);

  Route::get('/users/admin', [UserController::class, 'admin']);
  Route::get('/users/get-admin', [UserController::class, 'getAdmin']);
  Route::post('/users/add-admin', [UserController::class, 'addAdmin']);
  Route::post('/users/update-admin/{id}', [UserController::class, 'updateAdmin']);
});