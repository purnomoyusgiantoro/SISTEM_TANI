<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user || !in_array($user->role, $roles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda tidak memiliki akses ke resource ini.',
            ], 403);
        }

        if ($user->status !== 'aktif') {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda sedang dinonaktifkan.',
            ], 403);
        }

        return $next($request);
    }
}
