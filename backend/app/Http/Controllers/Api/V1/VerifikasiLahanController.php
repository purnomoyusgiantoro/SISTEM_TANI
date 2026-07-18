<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use App\Models\LogAktivitas;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerifikasiLahanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Lahan::with(['pemilik:id,nama,email', 'verifikator:id,nama']);

        // Allow filtering by status, but default to all statuses
        if ($request->filled('status')) {
            $query->where('status_verifikasi', $request->status);
        }

        $query->orderBy('tanggal_daftar', 'asc');

        $lahan = $query->paginate($request->input('per_page', 100));

        return response()->json([
            'status' => 'success',
            'data' => $lahan->items(),
            'meta' => [
                'current_page' => $lahan->currentPage(),
                'total' => $lahan->total(),
                'per_page' => $lahan->perPage(),
            ],
        ]);
    }

    public function terima(Request $request, int $id): JsonResponse
    {
        $lahan = Lahan::findOrFail($id);

        $lahan->update([
            'status_verifikasi' => 'terverifikasi',
            'verifikator_id' => $request->user()->id,
            'tanggal_verifikasi' => now(),
        ]);

        // Notifikasi ke petani
        Notifikasi::create([
            'user_id' => $lahan->pemilik_id,
            'judul' => 'Lahan Terverifikasi',
            'pesan' => "Lahan Anda di {$lahan->lokasi} telah diverifikasi dan diterima.",
            'tipe' => 'success',
        ]);

        // Log
        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Verifikasi Lahan',
            'detail' => "Memverifikasi lahan ID #{$lahan->id} milik {$lahan->pemilik->nama}",
            'level' => 'info',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lahan berhasil diverifikasi.',
            'data' => $lahan->fresh()->load('pemilik:id,nama', 'verifikator:id,nama'),
        ]);
    }

    public function tolak(Request $request, int $id): JsonResponse
    {
        $request->validate(['alasan' => 'required|string|max:1000']);

        $lahan = Lahan::findOrFail($id);

        $lahan->update([
            'status_verifikasi' => 'ditolak',
            'verifikator_id' => $request->user()->id,
            'tanggal_verifikasi' => now(),
            'alasan_ditolak' => $request->alasan,
        ]);

        Notifikasi::create([
            'user_id' => $lahan->pemilik_id,
            'judul' => 'Verifikasi Ditolak',
            'pesan' => "Verifikasi lahan di {$lahan->lokasi} ditolak: {$request->alasan}",
            'tipe' => 'error',
        ]);

        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Tolak Verifikasi Lahan',
            'detail' => "Menolak lahan ID #{$lahan->id}: {$request->alasan}",
            'level' => 'warning',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Verifikasi lahan ditolak.',
            'data' => $lahan->fresh()->load('pemilik:id,nama'),
        ]);
    }
}
