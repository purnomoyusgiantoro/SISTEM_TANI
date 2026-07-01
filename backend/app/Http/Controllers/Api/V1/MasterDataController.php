<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Wilayah;
use Illuminate\Http\JsonResponse;

class MasterDataController extends Controller
{
    public function wilayah(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => Wilayah::orderBy('nama')->get(),
        ]);
    }

    public function jenisLahan(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => ['Sawah', 'Tegalan', 'Perkebunan', 'Kolam', 'Ladang'],
        ]);
    }

    public function kategoriPeralatan(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => ['Pengolah Tanah', 'Penyemprotan', 'Panen', 'Irigasi', 'Perawatan', 'Teknologi'],
        ]);
    }

    public function jenisKegiatan(): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => [
                ['value' => 'tanam', 'label' => 'Penanaman', 'color' => '#10b981'],
                ['value' => 'pemupukan', 'label' => 'Pemupukan', 'color' => '#8b5cf6'],
                ['value' => 'penyemprotan', 'label' => 'Penyemprotan', 'color' => '#f59e0b'],
                ['value' => 'panen', 'label' => 'Panen', 'color' => '#ef4444'],
                ['value' => 'pengolahan', 'label' => 'Pengolahan Tanah', 'color' => '#6366f1'],
                ['value' => 'irigasi', 'label' => 'Irigasi', 'color' => '#0ea5e9'],
                ['value' => 'perawatan', 'label' => 'Perawatan', 'color' => '#14b8a6'],
            ],
        ]);
    }
}
