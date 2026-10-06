<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DiditService
{
  private string $baseUrl = 'https://verification.didit.me/v3';

  public function createSession(int|string $userId): array
  {
    return Http::withHeaders([
      'x-api-key' => config('services.didit.api_key'),
      'Content-Type' => 'application/json',
    ])->post($this->baseUrl . '/session/', [
          'workflow_id' => config('services.didit.workflow_id'),
          'vendor_data' => (string) $userId,
        ])->throw()->json();
  }

  public function getSession(string $sessionId): array
  {
    return Http::withHeaders([
      'x-api-key' => config('services.didit.api_key'),
    ])->get(
        $this->baseUrl . "/session/{$sessionId}/decision/"
      )->throw()->json();
  }
}