<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KegiatanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Kegiatan::with(['petani:id,nama', 'lahan:id,lokasi']);

        if ($request->user()->role === 'petani') {
            $query->where('petani_id', $request->user()->id);
        }

        if ($request->filled('jenis')) {
            $query->where('jenis', $request->jenis);
        }
        if ($request->filled('lahan_id')) {
            $query->where('lahan_id', $request->lahan_id);
        }
        if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
            $query->whereBetween('tanggal', [$request->tanggal_mulai, $request->tanggal_selesai]);
        }

        $kegiatan = $query->orderBy('tanggal', 'desc')
                          ->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $kegiatan->items(),
            'meta' => [
                'current_page' => $kegiatan->currentPage(),
                'total' => $kegiatan->total(),
                'per_page' => $kegiatan->perPage(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $kegiatan = Kegiatan::with(['petani:id,nama', 'lahan:id,lokasi,jenis_lahan'])->findOrFail($id);

        if ($request->user()->role === 'petani' && $kegiatan->petani_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $kegiatan]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lahan_id' => 'required|exists:lahan,id',
            'jenis' => 'required|in:tanam,pemupukan,penyemprotan,panen,pengolahan,irigasi,perawatan',
            'deskripsi' => 'required|string|max:2000',
            'tanggal' => 'required|date',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png|max:5120',
        ]);

        $validated['petani_id'] = $request->user()->id;

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('foto-kegiatan', 'public');
        }

        $kegiatan = Kegiatan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kegiatan berhasil dicatat.',
            'data' => $kegiatan->load(['petani:id,nama', 'lahan:id,lokasi']),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $kegiatan = Kegiatan::findOrFail($id);

        if ($kegiatan->petani_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        $validated = $request->validate([
            'jenis' => 'sometimes|in:tanam,pemupukan,penyemprotan,panen,pengolahan,irigasi,perawatan',
            'deskripsi' => 'sometimes|string|max:2000',
            'tanggal' => 'sometimes|date',
        ]);

        $kegiatan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kegiatan berhasil diperbarui.',
            'data' => $kegiatan->fresh()->load(['petani:id,nama', 'lahan:id,lokasi']),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $kegiatan = Kegiatan::findOrFail($id);

        if ($kegiatan->petani_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        $kegiatan->delete();

        return response()->json(['status' => 'success', 'message' => 'Kegiatan berhasil dihapus.']);
    }
}
