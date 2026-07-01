<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\LogAktivitas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }
        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(fn($qb) => $qb->where('nama', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%"));
        }

        $users = $query->orderBy('nama')->paginate($request->input('per_page', 15));

        return response()->json([
            'status' => 'success',
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'total' => $users->total(),
                'per_page' => $users->perPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:petani,pengurus,bpp,admin',
            'status' => 'sometimes|in:aktif,nonaktif',
        ]);

        $validated['name'] = $validated['nama']; // Laravel default field

        $user = User::create($validated);

        LogAktivitas::create([
            'user_id' => $request->user()->id,
            'user_name' => $request->user()->nama,
            'aksi' => 'Tambah Pengguna',
            'detail' => "Menambahkan pengguna baru: {$user->nama} ({$user->role})",
            'level' => 'info',
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengguna berhasil dibuat.',
            'data' => $user->only(['id', 'nama', 'email', 'role', 'status']),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:petani,pengurus,bpp,admin',
            'status' => 'sometimes|in:aktif,nonaktif',
        ]);

        if (isset($validated['nama'])) {
            $validated['name'] = $validated['nama'];
        }

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data pengguna berhasil diperbarui.',
            'data' => $user->fresh()->only(['id', 'nama', 'email', 'role', 'status']),
        ]);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update([
            'status' => $user->status === 'aktif' ? 'nonaktif' : 'aktif',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Pengguna {$user->nama} sekarang {$user->fresh()->status}.",
            'data' => $user->fresh()->only(['id', 'nama', 'email', 'role', 'status']),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        User::findOrFail($id)->delete();

        return response()->json(['status' => 'success', 'message' => 'Pengguna berhasil dihapus.']);
    }
}
