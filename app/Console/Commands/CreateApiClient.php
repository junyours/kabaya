<?php

namespace App\Console\Commands;

use App\Models\ApiClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateApiClient extends Command
{
    protected $signature = 'api-client:create';

    protected $description = 'Create an external API client';

    public function handle(): int
    {
        ApiClient::query()->delete();

        $key = 'client_' . Str::random(32);
        $secret = Str::random(64);

        ApiClient::create([
            'key' => $key,
            'secret' => Hash::make($secret),
        ]);

        $this->newLine();

        $this->info('API client created successfully.');

        $this->newLine();

        $this->line("X-API-Key: {$key}.{$secret}");

        $this->newLine();

        return self::SUCCESS;
    }
}