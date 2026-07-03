<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\LahanController;
use App\Http\Controllers\Api\V1\VerifikasiLahanController;
use App\Http\Controllers\Api\V1\PeralatanController;
use App\Http\Controllers\Api\V1\SewaController;
use App\Http\Controllers\Api\V1\TagihanController;
use App\Http\Controllers\Api\V1\KegiatanController;
use App\Http\Controllers\Api\V1\BeritaController;
use App\Http\Controllers\Api\V1\OrganisasiController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\NotifikasiController;
use App\Http\Controllers\Api\V1\LogAktivitasController;
use App\Http\Controllers\Api\V1\MasterDataController;
use App\Http\Controllers\Api\V1\BackupController;

/*
|--------------------------------------------------------------------------
| RuangTani API Routes v1
|--------------------------------------------------------------------------
*/

// ── Public (No Auth) ──
Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login']);
});

// ── Authenticated Routes ──
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::put('auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('auth/password', [AuthController::class, 'updatePassword']);

    // Dashboard
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);

    // Master Data
    Route::get('master/wilayah', [MasterDataController::class, 'wilayah']);
    Route::get('master/jenis-lahan', [MasterDataController::class, 'jenisLahan']);
    Route::get('master/kategori-peralatan', [MasterDataController::class, 'kategoriPeralatan']);
    Route::get('master/jenis-kegiatan', [MasterDataController::class, 'jenisKegiatan']);

    // Notifikasi
    Route::get('notifikasi', [NotifikasiController::class, 'index']);
    Route::get('notifikasi/unread-count', [NotifikasiController::class, 'unreadCount']);
    Route::put('notifikasi/{id}/read', [NotifikasiController::class, 'markAsRead']);
    Route::put('notifikasi/read-all', [NotifikasiController::class, 'markAllAsRead']);

    // ── Petani, Pengurus, BPP ──
    Route::middleware('role:petani,pengurus,bpp')->group(function () {
        Route::get('lahan', [LahanController::class, 'index']);
        Route::get('lahan/{id}', [LahanController::class, 'show']);
        Route::get('organisasi', [OrganisasiController::class, 'index']);
    });

    // ── Petani & Pengurus ──
    Route::middleware('role:petani,pengurus')->group(function () {
        Route::post('lahan', [LahanController::class, 'store']);
        Route::put('lahan/{id}', [LahanController::class, 'update']);

        Route::get('peralatan', [PeralatanController::class, 'index']);
        Route::get('peralatan/{id}', [PeralatanController::class, 'show']);

        Route::get('sewa', [SewaController::class, 'index']);
        Route::get('sewa/{id}', [SewaController::class, 'show']);

        Route::get('tagihan', [TagihanController::class, 'index']);
        Route::get('tagihan/{id}', [TagihanController::class, 'show']);

        Route::get('kegiatan', [KegiatanController::class, 'index']);
        Route::get('kegiatan/{id}', [KegiatanController::class, 'show']);

        Route::get('berita', [BeritaController::class, 'index']);
        Route::get('berita/{id}', [BeritaController::class, 'show']);
    });

    // ── Petani Only ──
    Route::middleware('role:petani')->group(function () {
        Route::post('sewa', [SewaController::class, 'store']);
        Route::post('tagihan/{id}/upload-bukti', [TagihanController::class, 'uploadBukti']);
        Route::post('kegiatan', [KegiatanController::class, 'store']);
        Route::put('kegiatan/{id}', [KegiatanController::class, 'update']);
        Route::delete('kegiatan/{id}', [KegiatanController::class, 'destroy']);
    });

    // ── Pengurus Only ──
    Route::middleware('role:pengurus')->group(function () {
        Route::delete('lahan/{id}', [LahanController::class, 'destroy']);
        Route::post('peralatan', [PeralatanController::class, 'store']);
        Route::put('peralatan/{id}', [PeralatanController::class, 'update']);
        Route::delete('peralatan/{id}', [PeralatanController::class, 'destroy']);
        Route::put('sewa/{id}/setujui', [SewaController::class, 'setujui']);
        Route::put('sewa/{id}/tolak', [SewaController::class, 'tolak']);
        Route::put('tagihan/{id}/verifikasi', [TagihanController::class, 'verifikasi']);
        Route::post('organisasi', [OrganisasiController::class, 'store']);
        Route::put('organisasi/{id}', [OrganisasiController::class, 'update']);
        Route::delete('organisasi/{id}', [OrganisasiController::class, 'destroy']);
    });

    // ── BPP Only ──
    Route::middleware('role:bpp')->group(function () {
        Route::get('verifikasi-lahan', [VerifikasiLahanController::class, 'index']);
        Route::put('verifikasi-lahan/{id}/terima', [VerifikasiLahanController::class, 'terima']);
        Route::put('verifikasi-lahan/{id}/tolak', [VerifikasiLahanController::class, 'tolak']);
        Route::post('berita', [BeritaController::class, 'store']);
        Route::put('berita/{id}', [BeritaController::class, 'update']);
        Route::delete('berita/{id}', [BeritaController::class, 'destroy']);
        Route::put('berita/{id}/publish', [BeritaController::class, 'togglePublish']);
    });

    // ── Admin Only ──
    Route::middleware('role:admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::put('users/{id}/toggle-status', [UserController::class, 'toggleStatus']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        Route::get('log-aktivitas', [LogAktivitasController::class, 'index']);
        Route::get('log-aktivitas/export', [LogAktivitasController::class, 'export']);

        // Backup
        Route::get('backups', [BackupController::class, 'index']);
        Route::post('backups', [BackupController::class, 'store']);
        Route::post('backups/{id}/restore', [BackupController::class, 'restore']);
        Route::delete('backups/{id}', [BackupController::class, 'destroy']);
        Route::get('backups/schedule', [BackupController::class, 'schedule']);
        Route::put('backups/schedule', [BackupController::class, 'updateSchedule']);
    });
});
