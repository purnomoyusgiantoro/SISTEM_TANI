<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use App\Models\Sewa;
use App\Models\Tagihan;
use App\Models\Peralatan;
use App\Models\User;
use App\Models\Berita;
use App\Models\LogAktivitas;
use App\Models\Backup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = [];

        switch ($user->role) {
            case 'petani':
                $myLahan = Lahan::where('pemilik_id', $user->id);
                $data = [
                    'total_lahan' => $myLahan->count(),
                    'luas_total' => $myLahan->sum('luas') . ' Ha',
                    'sewa_aktif' => Sewa::where('petani_id', $user->id)->where('status', 'aktif')->count(),
                    'tagihan_belum_bayar' => Tagihan::where('petani_id', $user->id)->where('status', 'belum_bayar')->count(),
                    'lahan_terbaru' => Lahan::where('pemilik_id', $user->id)->latest()->limit(5)->get(),
                    'sewa_terbaru' => Sewa::with('peralatan:id,nama')->where('petani_id', $user->id)->latest()->limit(5)->get(),
                ];
                break;

            case 'pengurus':
                $data = [
                    'total_lahan' => Lahan::count(),
                    'total_petani' => User::where('role', 'petani')->where('status', 'aktif')->count(),
                    'peralatan_tersedia' => Peralatan::sum('tersedia'),
                    'sewa_menunggu' => Sewa::where('validasi', 'pending')->count(),
                    'total_pendapatan' => Tagihan::where('status', 'lunas')->sum('jumlah'),
                    'pending_sewa' => Sewa::with(['petani:id,nama', 'peralatan:id,nama'])->where('validasi', 'pending')->latest()->limit(5)->get(),
                ];
                break;

            case 'bpp':
                $data = [
                    'lahan_terverifikasi' => Lahan::where('status_verifikasi', 'terverifikasi')->count(),
                    'pending_verifikasi' => Lahan::where('status_verifikasi', 'pending')->count(),
                    'ditolak' => Lahan::where('status_verifikasi', 'ditolak')->count(),
                    'total_berita' => Berita::count(),
                    'antrean_verifikasi' => Lahan::with('pemilik:id,nama')->where('status_verifikasi', 'pending')->latest()->limit(5)->get(),
                ];
                break;

            case 'admin':
                $data = [
                    'total_pengguna' => User::count(),
                    'pengguna_aktif' => User::where('status', 'aktif')->count(),
                    'backup_terakhir' => Backup::where('status', 'sukses')->latest()->value('created_at'),
                    'uptime' => '99.9%',
                    'log_terbaru' => LogAktivitas::latest('created_at')->limit(5)->get(),
                ];
                break;
        }

        return response()->json(['status' => 'success', 'data' => $data]);
    }
}
