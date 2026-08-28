<?php

namespace App\Http\Middleware;

use App\Models\ApiClient;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ExternalApiAuthentication
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {
        $apiKey = $request->header('X-API-Key');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API key is required.',
            ], 401);
        }

        $parts = explode('.', $apiKey, 2);

        if (count($parts) !== 2) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid API key.',
            ], 401);
        }

        [$key, $secret] = $parts;

        $client = ApiClient::where('key', $key)
            ->first();

        if (!$client || !$client->checkSecret($secret)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid API key.',
            ], 401);
        }

        $request->attributes->set('api_client', $client);

        return $next($request);
    }
}