<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Berita;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BeritaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Berita::with('penulis:id,nama');

        // Petani/Pengurus only see published
        if (in_array($request->user()->role, ['petani', 'pengurus'])) {
            $query->where('status', 'published');
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        $berita = $query->orderBy('tanggal', 'desc')
                        ->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $berita->items(),
            'meta' => [
                'current_page' => $berita->currentPage(),
                'total' => $berita->total(),
                'per_page' => $berita->perPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => Berita::with('penulis:id,nama')->findOrFail($id),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'kategori' => 'required|string|max:100',
            'isi' => 'required|string',
            'status' => 'sometimes|in:draft,published',
        ]);

        $validated['penulis_id'] = $request->user()->id;
        $validated['tanggal'] = now()->toDateString();

        $berita = Berita::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Berita berhasil dibuat.',
            'data' => $berita->load('penulis:id,nama'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $berita = Berita::findOrFail($id);

        $validated = $request->validate([
            'judul' => 'sometimes|string|max:255',
            'kategori' => 'sometimes|string|max:100',
            'isi' => 'sometimes|string',
            'status' => 'sometimes|in:draft,published',
        ]);

        $berita->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Berita berhasil diperbarui.',
            'data' => $berita->fresh()->load('penulis:id,nama'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Berita::findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Berita berhasil dihapus.']);
    }

    public function togglePublish(int $id): JsonResponse
    {
        $berita = Berita::findOrFail($id);
        $berita->update([
            'status' => $berita->status === 'published' ? 'draft' : 'published',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status berita diubah menjadi ' . $berita->fresh()->status . '.',
            'data' => $berita->fresh(),
        ]);
    }
}
