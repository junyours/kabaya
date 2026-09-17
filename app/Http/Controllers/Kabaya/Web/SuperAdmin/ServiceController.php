<?php

namespace App\Http\Controllers\Kabaya\Web\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\LinkSystem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function linkSystem()
    {
        return Inertia::render('app/super-admin/services/link-system');
    }

    public function getLinkSystem(Request $request)
    {
        $systems = LinkSystem::query()
            ->select([
                'id',
                'label',
                'icon',
                'href',
                'is_active',
                'is_open',
            ])
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->input('search');

                $query->where('label', 'like', "%{$search}%");
            })
            ->paginate(10);

        return response()->json($systems);
    }

    public function addLinkSystem(Request $request)
    {
        $data = $request->validate([
            'label' => ['required', 'string'],
            'icon' => ['required', 'image', 'mimes:jpg,jpeg,png,webp'],
            'href' => ['required', 'url'],
            'is_active' => ['required', 'boolean'],
            'is_open' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('icon')) {
            $data['icon'] = $this->uploadIcon($request->file('icon'));
        }

        LinkSystem::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Service link created successfully.',
        ], 201);
    }

    public function updateLinkSystem(Request $request)
    {
        $system = LinkSystem::findOrFail($request->id);

        $data = $request->validate([
            'label' => ['required', 'string'],
            'icon' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp'],
            'href' => ['required', 'url'],
            'is_active' => ['required', 'boolean'],
            'is_open' => ['required', 'boolean'],
        ]);

        if ($request->hasFile('icon')) {
            $this->deleteIcon($system->icon);
            $data['icon'] = $this->uploadIcon($request->file('icon'));
        }

        $system->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Service link updated successfully.',
        ]);
    }

    private function uploadIcon($file)
    {
        $accessToken = $this->token();
        $folderId = config('services.google.link_system_folder_id');

        $parentFolderId = $this->getOrCreateFolder(
            $accessToken,
            'icons',
            $folderId
        );

        $metadata = [
            'name' => 'temp_' . time(),
            'parents' => [$parentFolderId],
        ];

        $response = Http::withToken($accessToken)
            ->attach(
                'metadata',
                json_encode($metadata),
                'metadata.json',
                ['Content-Type' => 'application/json']
            )
            ->attach(
                'media',
                file_get_contents($file),
                $file->getClientOriginalName(),
                ['Content-Type' => $file->getMimeType()]
            )
            ->post(
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
            );

        $response->throw();

        $fileId = $response->json('id');

        Http::withToken($accessToken)
            ->patch(
                "https://www.googleapis.com/drive/v3/files/{$fileId}",
                [
                    'name' => $fileId,
                ]
            )
            ->throw();

        Http::withToken($accessToken)
            ->post(
                "https://www.googleapis.com/drive/v3/files/{$fileId}/permissions",
                [
                    'role' => 'reader',
                    'type' => 'anyone',
                ]
            )
            ->throw();

        return $fileId;
    }

    private function deleteIcon(?string $fileId)
    {
        if (!$fileId) {
            return;
        }

        Http::withToken($this->token())
            ->delete(
                "https://www.googleapis.com/drive/v3/files/{$fileId}"
            );
    }
}