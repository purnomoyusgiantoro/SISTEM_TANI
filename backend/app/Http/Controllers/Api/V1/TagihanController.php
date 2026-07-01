<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagihanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Tagihan::with(['sewa:id,kode_sewa,peralatan_id', 'sewa.peralatan:id,nama', 'petani:id,nama']);

        if ($request->user()->role === 'petani') {
            $query->where('petani_id', $request->user()->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $tagihan = $query->orderBy('created_at', 'desc')
                         ->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $tagihan->items(),
            'meta' => [
                'current_page' => $tagihan->currentPage(),
                'total' => $tagihan->total(),
                'per_page' => $tagihan->perPage(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $tagihan = Tagihan::with(['sewa.peralatan', 'petani:id,nama,email'])->findOrFail($id);

        if ($request->user()->role === 'petani' && $tagihan->petani_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $tagihan]);
    }

    public function uploadBukti(Request $request, int $id): JsonResponse
    {
        $tagihan = Tagihan::findOrFail($id);

        if ($tagihan->petani_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Akses ditolak.'], 403);
        }

        if ($tagihan->status !== 'belum_bayar') {
            return response()->json(['status' => 'error', 'message' => 'Tagihan ini tidak bisa dibayar.'], 422);
        }

        $request->validate([
            'bukti_pembayaran' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'jumlah_dibayar' => 'required|integer|min:1',
            'tanggal_bayar' => 'required|date|before_or_equal:today',
            'catatan' => 'nullable|string|max:500',
        ]);

        $path = $request->file('bukti_pembayaran')->store('bukti-pembayaran', 'public');

        $tagihan->update([
            'status' => 'menunggu_verifikasi',
            'tanggal_bayar' => $request->tanggal_bayar,
            'bukti_pembayaran' => $path,
            'jumlah_dibayar' => $request->jumlah_dibayar,
            'catatan_pembayaran' => $request->catatan,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bukti pembayaran berhasil diupload. Menunggu verifikasi pengurus.',
            'data' => $tagihan->fresh(),
        ]);
    }

    public function verifikasi(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'aksi' => 'required|in:setujui,tolak',
        ]);

        $tagihan = Tagihan::with('petani')->findOrFail($id);

        if ($tagihan->status !== 'menunggu_verifikasi') {
            return response()->json(['status' => 'error', 'message' => 'Tagihan ini tidak menunggu verifikasi.'], 422);
        }

        $approved = $request->aksi === 'setujui';

        $tagihan->update([
            'status' => $approved ? 'lunas' : 'belum_bayar',
            'verifikasi_oleh' => $request->user()->id,
            'tanggal_verifikasi' => now(),
            'bukti_pembayaran' => $approved ? $tagihan->bukti_pembayaran : null,
            'tanggal_bayar' => $approved ? $tagihan->tanggal_bayar : null,
        ]);

        Notifikasi::create([
            'user_id' => $tagihan->petani_id,
            'judul' => $approved ? 'Pembayaran Diverifikasi' : 'Pembayaran Ditolak',
            'pesan' => $approved
                ? "Pembayaran tagihan {$tagihan->kode_tagihan} telah diverifikasi dan dinyatakan lunas."
                : "Pembayaran tagihan {$tagihan->kode_tagihan} ditolak. Silakan upload ulang bukti pembayaran.",
            'tipe' => $approved ? 'success' : 'error',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => $approved ? 'Pembayaran diverifikasi. Status: Lunas.' : 'Pembayaran ditolak.',
            'data' => $tagihan->fresh(),
        ]);
    }
}
