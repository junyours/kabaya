<?php

namespace App\Http\Controllers;

use App\Services\DiditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DiditController extends Controller
{
    public function createSession(
        Request $request,
        DiditService $didit
    ): JsonResponse {
        $user = $request->user();

        $session = $didit->createSession($user->id);

        return response()->json([
            'session_id' => $session['session_id'] ?? null,
            'session_url' => $session['session_url'] ?? $session['url'] ?? null,
        ]);
    }
}
