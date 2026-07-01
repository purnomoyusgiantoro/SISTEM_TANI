<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sewa', function (Blueprint $table) {
            $table->id();
            $table->string('kode_sewa', 20)->unique();
            $table->foreignId('petani_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('peralatan_id')->constrained('peralatan')->cascadeOnDelete();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->unsignedSmallInteger('durasi');
            $table->unsignedInteger('total_biaya');
            $table->enum('status', ['menunggu', 'aktif', 'selesai', 'dibatalkan'])->default('menunggu');
            $table->enum('validasi', ['pending', 'disetujui', 'ditolak'])->default('pending');
            $table->foreignId('validasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('tanggal_validasi')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('petani_id');
            $table->index('peralatan_id');
            $table->index('status');
            $table->index('validasi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sewa');
    }
};
