<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LahanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Lahan::with(['pemilik:id,nama', 'verifikator:id,nama']);

        // Petani only sees own land
        if ($user->role === 'petani') {
            $query->where('pemilik_id', $user->id);
        }

        // Filters
        if ($request->filled('wilayah')) {
            $query->where('lokasi', 'like', '%' . $request->wilayah . '%');
        }
        if ($request->filled('jenis_lahan')) {
            $query->where('jenis_lahan', $request->jenis_lahan);
        }
        if ($request->filled('status_verifikasi')) {
            $query->where('status_verifikasi', $request->status_verifikasi);
        }
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($qb) use ($q) {
                $qb->where('lokasi', 'like', "%{$q}%")
                   ->orWhereHas('pemilik', fn($p) => $p->where('nama', 'like', "%{$q}%"));
            });
        }

        $lahan = $query->orderBy('created_at', 'desc')
                       ->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $lahan->items(),
            'meta' => [
                'current_page' => $lahan->currentPage(),
                'total' => $lahan->total(),
                'per_page' => $lahan->perPage(),
                'last_page' => $lahan->lastPage(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $lahan = Lahan::with(['pemilik:id,nama,email', 'verifikator:id,nama'])->findOrFail($id);

        if ($request->user()->role === 'petani' && $lahan->pemilik_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $lahan]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lokasi' => 'required|string|max:255',
            'luas' => 'required|numeric|min:0.01|max:9999.99',
            'jenis_lahan' => 'required|in:Sawah,Tegalan,Perkebunan,Kolam,Ladang',
            'koordinat' => 'nullable|string|max:50',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $validated['pemilik_id'] = $request->user()->id;
        $validated['tanggal_daftar'] = now()->toDateString();
        $validated['status_verifikasi'] = 'pending';

        $lahan = Lahan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Lahan berhasil didaftarkan.',
            'data' => $lahan->load('pemilik:id,nama'),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $lahan = Lahan::findOrFail($id);

        if ($request->user()->role === 'petani' && $lahan->pemilik_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        $validated = $request->validate([
            'lokasi' => 'sometimes|string|max:255',
            'luas' => 'sometimes|numeric|min:0.01|max:9999.99',
            'jenis_lahan' => 'sometimes|in:Sawah,Tegalan,Perkebunan,Kolam,Ladang',
            'koordinat' => 'nullable|string|max:50',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $lahan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data lahan berhasil diperbarui.',
            'data' => $lahan->fresh()->load('pemilik:id,nama'),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $lahan = Lahan::findOrFail($id);
        $lahan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Lahan berhasil dihapus.',
        ]);
    }
}
