<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\LogAktivitas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogAktivitasController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = LogAktivitas::with('user:id,nama');

        if ($request->filled('level')) {
            $query->where('level', $request->level);
        }
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($qb) use ($q) {
                $qb->where('user_name', 'like', "%{$q}%")
                   ->orWhere('aksi', 'like', "%{$q}%")
                   ->orWhere('detail', 'like', "%{$q}%");
            });
        }
        if ($request->filled('tanggal_mulai') && $request->filled('tanggal_selesai')) {
            $query->whereBetween('created_at', [$request->tanggal_mulai, $request->tanggal_selesai . ' 23:59:59']);
        }

        $logs = $query->orderBy('created_at', 'desc')
                      ->paginate($request->input('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'total' => $logs->total(),
                'per_page' => $logs->perPage(),
            ],
        ]);
    }

    public function export(Request $request): JsonResponse
    {
        // Simplified: return data as JSON for CSV generation on frontend
        $logs = LogAktivitas::orderBy('created_at', 'desc')
            ->limit(1000)
            ->get(['user_name', 'aksi', 'detail', 'level', 'ip_address', 'created_at']);

        return response()->json([
            'status' => 'success',
            'data' => $logs,
        ]);
    }
}
