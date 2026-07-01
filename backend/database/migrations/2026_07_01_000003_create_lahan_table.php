<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lahan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pemilik_id')->constrained('users')->cascadeOnDelete();
            $table->string('lokasi', 255);
            $table->decimal('luas', 8, 2);
            $table->enum('jenis_lahan', ['Sawah', 'Tegalan', 'Perkebunan', 'Kolam', 'Ladang']);
            $table->enum('status_verifikasi', ['pending', 'terverifikasi', 'ditolak'])->default('pending');
            $table->string('koordinat', 50)->nullable();
            $table->date('tanggal_daftar');
            $table->foreignId('verifikator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->text('catatan')->nullable();
            $table->text('alasan_ditolak')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('pemilik_id');
            $table->index('status_verifikasi');
            $table->index('jenis_lahan');
            $table->index('verifikator_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lahan');
    }
};
