<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Organisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganisasiController extends Controller
{
    public function index(): JsonResponse
    {
        $tree = Organisasi::whereNull('parent_id')
            ->with('children')
            ->orderBy('urutan')
            ->get();

        return response()->json(['status' => 'success', 'data' => $tree]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'jabatan' => 'required|string|max:100',
            'parent_id' => 'nullable|exists:organisasi,id',
            'urutan' => 'sometimes|integer',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $org = Organisasi::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Anggota organisasi berhasil ditambahkan.',
            'data' => $org,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $org = Organisasi::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:100',
            'jabatan' => 'sometimes|string|max:100',
            'parent_id' => 'nullable|exists:organisasi,id',
            'urutan' => 'sometimes|integer',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $org->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data organisasi berhasil diperbarui.',
            'data' => $org->fresh(),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Organisasi::findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Anggota organisasi berhasil dihapus.']);
    }
}
