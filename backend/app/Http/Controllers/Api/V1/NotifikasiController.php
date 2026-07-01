<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notifikasi = Notifikasi::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json([
            'status' => 'success',
            'data' => $notifikasi->items(),
            'meta' => [
                'current_page' => $notifikasi->currentPage(),
                'total' => $notifikasi->total(),
                'per_page' => $notifikasi->perPage(),
            ],
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notifikasi::where('user_id', $request->user()->id)
            ->where('dibaca', false)
            ->count();

        return response()->json(['status' => 'success', 'data' => ['unread_count' => $count]]);
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notif = Notifikasi::where('user_id', $request->user()->id)->findOrFail($id);
        $notif->update(['dibaca' => true, 'dibaca_pada' => now()]);

        return response()->json(['status' => 'success', 'message' => 'Notifikasi ditandai sudah dibaca.']);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        Notifikasi::where('user_id', $request->user()->id)
            ->where('dibaca', false)
            ->update(['dibaca' => true, 'dibaca_pada' => now()]);

        return response()->json(['status' => 'success', 'message' => 'Semua notifikasi ditandai sudah dibaca.']);
    }
}
