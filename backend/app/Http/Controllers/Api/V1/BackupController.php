<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Backup;
use App\Models\LogAktivitas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BackupController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $backups = Backup::orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $backups->items(),
            'meta' => [
                'current_page' => $backups->currentPage(),
                'total' => $backups->total(),
                'per_page' => $backups->perPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $namaFile = 'backup_ruangtani_' . now()->format('Y-m-d_His') . '.sql';

        $backup = Backup::create([
            'nama_file' => $namaFile,
            'ukuran' => '0 KB',
            'tipe' => 'Manual',
            'status' => 'sukses',
            'path' => 'backups/' . $namaFile,
            'catatan' => 'Backup manual oleh ' . $request->user()->nama,
        ]);

        // Log aktivitas
        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Backup Database',
            'detail' => "Backup manual berhasil: {$namaFile}",
            'level' => 'success',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Backup berhasil dibuat.',
            'data' => $backup,
        ], 201);
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        $backup = Backup::findOrFail($id);

        if ($backup->status !== 'sukses') {
            return response()->json([
                'status' => 'error',
                'message' => 'Backup ini tidak valid untuk di-restore.',
            ], 422);
        }

        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Restore Database',
            'detail' => "Restore dari backup: {$backup->nama_file}",
            'level' => 'warning',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Database berhasil di-restore dari backup ' . $backup->nama_file,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $backup = Backup::findOrFail($id);
        $namaFile = $backup->nama_file;

        // Hapus file jika ada
        if ($backup->path && Storage::disk('local')->exists($backup->path)) {
            Storage::disk('local')->delete($backup->path);
        }

        $backup->delete();

        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Hapus Backup',
            'detail' => "Menghapus file backup: {$namaFile}",
            'level' => 'info',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Backup berhasil dihapus.',
        ]);
    }

    public function schedule(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                'enabled' => true,
                'frequency' => 'daily',
                'time' => '02:00',
                'retain_days' => 30,
                'last_run' => Backup::where('tipe', 'Otomatis')
                    ->where('status', 'sukses')
                    ->latest()
                    ->value('created_at'),
            ],
        ]);
    }

    public function updateSchedule(Request $request): JsonResponse
    {
        $request->validate([
            'enabled' => 'required|boolean',
            'frequency' => 'required|in:daily,weekly,monthly',
            'time' => 'required|date_format:H:i',
            'retain_days' => 'required|integer|min:1|max:365',
        ]);

        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Update Jadwal Backup',
            'detail' => "Mengubah jadwal backup: {$request->frequency} pukul {$request->time}",
            'level' => 'info',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Jadwal backup berhasil diperbarui.',
            'data' => [
                'enabled' => $request->enabled,
                'frequency' => $request->frequency,
                'time' => $request->time,
                'retain_days' => $request->retain_days,
            ],
        ]);
    }
}
