<?php

use App\Http\Controllers\Kabaya\Web\Settings\ChangePasswordController;
use App\Http\Controllers\WebController;
use Illuminate\Support\Facades\Route;

Route::get('/', [WebController::class, 'home']);
Route::get('/privacy-policy', [WebController::class, 'privacyPolicy']);

Route::middleware(['auth:sanctum'])->prefix('settings')->group(function () {
  Route::get('/change-password', [ChangePasswordController::class, 'index']);
  Route::post('/change-password', [ChangePasswordController::class, 'store']);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/web.super-admin.php';
require __DIR__ . '/web.admin.php';
