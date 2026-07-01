<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Peralatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PeralatanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Peralatan::query();

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }
        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }
        if ($request->boolean('tersedia')) {
            $query->where('tersedia', '>', 0);
        }

        $peralatan = $query->orderBy('nama')->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $peralatan->items(),
            'meta' => [
                'current_page' => $peralatan->currentPage(),
                'total' => $peralatan->total(),
                'per_page' => $peralatan->perPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => Peralatan::findOrFail($id),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:150',
            'kategori' => 'required|in:Pengolah Tanah,Penyemprotan,Panen,Irigasi,Perawatan,Teknologi',
            'deskripsi' => 'nullable|string',
            'harga_per_hari' => 'required|integer|min:1',
            'stok' => 'required|integer|min:0',
            'kondisi' => 'sometimes|in:Baik,Cukup Baik,Perlu Perbaikan,Rusak',
        ]);

        $validated['tersedia'] = $validated['stok'];

        $peralatan = Peralatan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Peralatan berhasil ditambahkan.',
            'data' => $peralatan,
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $peralatan = Peralatan::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:150',
            'kategori' => 'sometimes|in:Pengolah Tanah,Penyemprotan,Panen,Irigasi,Perawatan,Teknologi',
            'deskripsi' => 'nullable|string',
            'harga_per_hari' => 'sometimes|integer|min:1',
            'stok' => 'sometimes|integer|min:0',
            'tersedia' => 'sometimes|integer|min:0',
            'kondisi' => 'sometimes|in:Baik,Cukup Baik,Perlu Perbaikan,Rusak',
        ]);

        $peralatan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Peralatan berhasil diperbarui.',
            'data' => $peralatan->fresh(),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Peralatan::findOrFail($id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Peralatan berhasil dihapus.',
        ]);
    }
}
