<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('peralatan', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 150);
            $table->enum('kategori', ['Pengolah Tanah', 'Penyemprotan', 'Panen', 'Irigasi', 'Perawatan', 'Teknologi']);
            $table->text('deskripsi')->nullable();
            $table->unsignedInteger('harga_per_hari');
            $table->unsignedSmallInteger('stok')->default(0);
            $table->unsignedSmallInteger('tersedia')->default(0);
            $table->string('gambar', 255)->nullable();
            $table->enum('kondisi', ['Baik', 'Cukup Baik', 'Perlu Perbaikan', 'Rusak'])->default('Baik');
            $table->timestamps();
            $table->softDeletes();

            $table->index('kategori');
            $table->index('kondisi');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peralatan');
    }
};
