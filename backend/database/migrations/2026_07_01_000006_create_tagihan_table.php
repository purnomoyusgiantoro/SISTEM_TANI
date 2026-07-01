<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_tagihan', 20)->unique();
            $table->foreignId('sewa_id')->constrained('sewa')->cascadeOnDelete();
            $table->foreignId('petani_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('jumlah');
            $table->date('tanggal_tagihan');
            $table->date('jatuh_tempo');
            $table->enum('status', ['belum_bayar', 'menunggu_verifikasi', 'lunas'])->default('belum_bayar');
            $table->date('tanggal_bayar')->nullable();
            $table->string('bukti_pembayaran', 255)->nullable();
            $table->unsignedInteger('jumlah_dibayar')->nullable();
            $table->text('catatan_pembayaran')->nullable();
            $table->foreignId('verifikasi_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->timestamps();

            $table->index('sewa_id');
            $table->index('petani_id');
            $table->index('status');
            $table->index('jatuh_tempo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihan');
    }
};
