<?php

use App\Http\Controllers\Api\External\UserController;

Route::prefix('external')
  ->middleware('external.api')
  ->group(function () {

    Route::get('/v1/users/verified', [
      UserController::class,
      'getVerifiedUserByIdNumber'
    ]);
  });

require __DIR__ . '/kabaya.php';
