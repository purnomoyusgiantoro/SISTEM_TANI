<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('backups', function (Blueprint $table) {
            $table->id();
            $table->string('nama_file', 255);
            $table->string('ukuran', 20);
            $table->enum('tipe', ['Otomatis', 'Manual']);
            $table->enum('status', ['sukses', 'gagal', 'proses'])->default('proses');
            $table->string('path', 500)->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backups');
    }
};
