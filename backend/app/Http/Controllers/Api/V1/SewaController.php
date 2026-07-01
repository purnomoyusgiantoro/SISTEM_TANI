<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Sewa;
use App\Models\Peralatan;
use App\Models\Tagihan;
use App\Models\LogAktivitas;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SewaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Sewa::with(['petani:id,nama', 'peralatan:id,nama', 'validator:id,nama']);

        if ($request->user()->role === 'petani') {
            $query->where('petani_id', $request->user()->id);
        }

        $sewa = $query->orderBy('created_at', 'desc')
                      ->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $sewa->items(),
            'meta' => [
                'current_page' => $sewa->currentPage(),
                'total' => $sewa->total(),
                'per_page' => $sewa->perPage(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $sewa = Sewa::with(['petani:id,nama,email', 'peralatan', 'validator:id,nama', 'tagihan'])->findOrFail($id);

        if ($request->user()->role === 'petani' && $sewa->petani_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $sewa]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'peralatan_id' => 'required|exists:peralatan,id',
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'catatan' => 'nullable|string|max:500',
        ]);

        $peralatan = Peralatan::findOrFail($validated['peralatan_id']);

        if ($peralatan->tersedia <= 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Peralatan tidak tersedia saat ini.',
            ], 422);
        }

        $mulai = new \DateTime($validated['tanggal_mulai']);
        $selesai = new \DateTime($validated['tanggal_selesai']);
        $durasi = $selesai->diff($mulai)->days;
        $totalBiaya = $durasi * $peralatan->harga_per_hari;

        // Generate kode sewa
        $lastSewa = Sewa::whereYear('created_at', now()->year)->count();
        $kodeSewa = 'SW-' . now()->year . '-' . str_pad($lastSewa + 1, 3, '0', STR_PAD_LEFT);

        $sewa = Sewa::create([
            'kode_sewa' => $kodeSewa,
            'petani_id' => $request->user()->id,
            'peralatan_id' => $peralatan->id,
            'tanggal_mulai' => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'durasi' => $durasi,
            'total_biaya' => $totalBiaya,
            'status' => 'menunggu',
            'validasi' => 'pending',
            'catatan' => $validated['catatan'] ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan sewa berhasil dikirim. Menunggu validasi pengurus.',
            'data' => $sewa->load(['petani:id,nama', 'peralatan:id,nama']),
        ], 201);
    }

    public function setujui(Request $request, int $id): JsonResponse
    {
        $sewa = Sewa::with('peralatan', 'petani')->findOrFail($id);

        if ($sewa->validasi !== 'pending') {
            return response()->json(['status' => 'error', 'message' => 'Sewa ini sudah divalidasi.'], 422);
        }

        // Update sewa status
        $sewa->update([
            'status' => 'aktif',
            'validasi' => 'disetujui',
            'validasi_oleh' => $request->user()->id,
            'tanggal_validasi' => now(),
        ]);

        // Kurangi stok peralatan
        $sewa->peralatan->decrement('tersedia');

        // Buat tagihan otomatis
        $lastTagihan = Tagihan::whereYear('created_at', now()->year)->count();
        $kodeTagihan = 'TG-' . now()->year . '-' . str_pad($lastTagihan + 1, 3, '0', STR_PAD_LEFT);

        Tagihan::create([
            'kode_tagihan' => $kodeTagihan,
            'sewa_id' => $sewa->id,
            'petani_id' => $sewa->petani_id,
            'jumlah' => $sewa->total_biaya,
            'tanggal_tagihan' => now()->toDateString(),
            'jatuh_tempo' => now()->addDays(10)->toDateString(),
            'status' => 'belum_bayar',
        ]);

        // Notifikasi ke petani
        Notifikasi::create([
            'user_id' => $sewa->petani_id,
            'judul' => 'Sewa Disetujui',
            'pesan' => "Pengajuan sewa {$sewa->peralatan->nama} telah disetujui.",
            'tipe' => 'success',
        ]);

        // Log
        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Validasi Sewa',
            'detail' => "Menyetujui pengajuan sewa {$sewa->kode_sewa}",
            'level' => 'info',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sewa berhasil disetujui. Tagihan telah dibuat.',
            'data' => $sewa->fresh()->load(['petani:id,nama', 'peralatan:id,nama', 'tagihan']),
        ]);
    }

    public function tolak(Request $request, int $id): JsonResponse
    {
        $sewa = Sewa::with('peralatan', 'petani')->findOrFail($id);

        if ($sewa->validasi !== 'pending') {
            return response()->json(['status' => 'error', 'message' => 'Sewa ini sudah divalidasi.'], 422);
        }

        $sewa->update([
            'status' => 'selesai',
            'validasi' => 'ditolak',
            'validasi_oleh' => $request->user()->id,
            'tanggal_validasi' => now(),
        ]);

        Notifikasi::create([
            'user_id' => $sewa->petani_id,
            'judul' => 'Sewa Ditolak',
            'pesan' => "Pengajuan sewa {$sewa->peralatan->nama} ditolak oleh pengurus.",
            'tipe' => 'error',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengajuan sewa ditolak.',
            'data' => $sewa->fresh()->load(['petani:id,nama', 'peralatan:id,nama']),
        ]);
    }
}
