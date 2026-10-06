<?php

use App\Http\Controllers\Api\External\UserController;
use App\Http\Controllers\DiditWebhookController;

Route::prefix('external')
  ->middleware('external.api')
  ->group(function () {

    Route::get('/v1/users/verified', [
      UserController::class,
      'getVerifiedUserByIdNumber'
    ]);
  });

Route::post('/webhooks/didit', [DiditWebhookController::class, 'handle']);

require __DIR__ . '/kabaya.php';
